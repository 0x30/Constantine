---
categories: IOS
title: UITextFiled NSTextAlignment.right 空格问题
tags:
  - IOS
  - UITextFiled
  - IOS Bug
  - runtime
date: 2018-12-04 11:25:00
---

在开发的时候遇到一个问题，我们的测试找到我，跟我说，我的邮箱输入的明明是对的，为什么告诉我不符合规则呢？我开始了问题排除。

````swift
func emailVerfication(disposeBag: DisposeBag) -> Observable<String?> {

    let vCodeBehaviorSubject = BehaviorSubject<String?>(value: nil)

    let pattern = "^[\\w._%+-|]+@[\\w0-9.-]+\\.[A-Za-z]{2,}$"

    let textObservable = rx.text.distinctUntilChanged().filterNil()

    textObservable.filter { text in text.count <= 0 }.map { _ in "邮箱不可为空" }.bind(to: vCodeBehaviorSubject).disposed(by: disposeBag)
    textObservable.filter { text in text.count > 0 }.map { Validator.regex(pattern).apply($0) ? nil : "邮箱格式不正确" }.bind(to: vCodeBehaviorSubject).disposed(by: disposeBag)

    return vCodeBehaviorSubject
}
````

是我的代码出了问题吗？

<!-- more -->

## 问题思考

![](/publicFiles/emoticons/思考.jpeg "开动脑筋")

看我的验证没问题，最主要的是，我的手机上没有问题啊。我就找到测试，问他要到了复线办法，他意思是，得用搜狗输入法。他给我演示了一下，就是邮箱上输入`qq` ，应该是搜狗曾经输入过她的邮箱，她的邮箱默认就在 `inputAccessoryView` 显示了，她点击之后。我识别不出来？我就在想是不是 搜狗输入法？在调用这个方法的时候

````swift
/// 我想象中的搜狗输入法触发
textInputView.text = ""

/// 没有触发以下方法，导致我没监听到
textInputView.sendActions(for: UIControl.Event.valueChanged)
````

试试吧，发现，，并没有。它触发了。。。。

![](/publicFiles/emoticons/疑惑.jpeg "这也行")

那就找问题吧

## 定位问题

我查看文字发生变化，最后有一个空格导致，没有过正则表达式。但是？？？？为什么输入框没有展示呢？？？

我尝试了输入了一下空格，还真没有？？？要是显示出来用户也可以知道是空格，就把空格删除了。现在连空格都没有显示出来？啥情况啊？

难道？是因为我用的 自动大些输入框写错了？

````swift
class UppercasedTextFiled: UITextField {

    private let disposeBag = DisposeBag()

    override init(frame: CGRect) {

        super.init(frame: frame)

        self._init()
    }

    required init?(coder aDecoder: NSCoder) {

        super.init(coder: aDecoder)

        self._init()
    }

    private func _init() {

        self.keyboardType = UIKeyboardType.asciiCapable

        self.rx.text.map { text in text?.uppercased() }.bind(to: self.rx.textAndSelectIndex).disposed(by: disposeBag)
    }
}
````

````swift
/// 配置 输入框的 内容 以及 保持选中的位置
var textAndSelectIndex: Binder<String?> {
    return Binder(self.base) { textFiled, text in
        textFiled.updateText({ (_) in
            textFiled.text = text
        })
    }
}
````

````swift
extension UITextInput {

    /// 更新文字，并且保持 输入框的 插入位置的方法
    ///
    /// - Parameter change: 修改回调
    func updateText(_ change: ((_ textFiled: UITextInput) -> Void)) {

        let editRange = selectedTextRange
        change(self)
        selectedTextRange = editRange
    }
}
````

我测试了一下没有问题啊？？？但是为什么没有空格嗯？

![](/publicFiles/emoticons/事情没有那么简单.jpg "事情没有那么简单")

果然.... 问题比较严重 [Right aligned UITextField spacebar does not advance cursor in iOS 7](https://stackoverflow.com/q/19569688/4242817)

## 解决问题

这是系统的问题，UITextFiled 设置为 right align之后，就会出现空格不显示的问题。

好吧...  问题也比较好解决，使用 `\u00a0` 替换空格字符串就好了

但是... 我这，有的输入框已经自定义了，默认大写输入框了，这现在又再加一个这个？？？我有很多右侧输入输入框呢... 每一个都定义自定义类，也麻烦。

想办法 集体解决吧。。。。

过程就不赘述了，直接使用一下就可以了

````swift
import UIKit

extension UITextField {
    /// Runtime 键
    private struct AssociatedKeys {

        static var toggleState: UInt8 = 0
    }

    private var isFixedRightSpace: Bool {
        get {
            return objc_getAssociatedObject(self, &AssociatedKeys.toggleState) as? Bool ?? false
        }
        set(newValue) {
            objc_setAssociatedObject(self, &AssociatedKeys.toggleState, newValue, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        }
    }

    open override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {

        if self.textAlignment == .right && !isFixedRightSpace {
            self.isFixedRightSpace = true
            self.addTarget(self, action: #selector(replaceNormalSpacesWithNonBreakingSpaces(textFiled:)), for: UIControl.Event.editingChanged)
        }

        return super.hitTest(point, with: event)
    }

    @objc func replaceNormalSpacesWithNonBreakingSpaces(textFiled: UITextField) {

        if textFiled.markedTextRange == nil && textFiled.text?.contains(find: " ") ?? false {

            textFiled.updateText { (_) in

                textFiled.text = textFiled.text?.replacingOccurrences(of: " ", with: "\u{00a0}")
            }
        }
    }
}
````

🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉  解决喽喽喽喽喽