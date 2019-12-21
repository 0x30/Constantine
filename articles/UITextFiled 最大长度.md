---
categories: IOS
title: UITextfiled 最大输入长度
tags:
  - IOS
  - UITextFiled
  - runtime
date: 2018-12-04 12:25:00
---

我们总会遇到一个问题，输入框的长度限制。现在把它进行一下优化，在 StoryBoard 就可以直接设置。

感谢，[Fattie 的回答](https://stackoverflow.com/a/43099816/4242817)，提供了一个很好的思路～

<!-- more -->

中间的过程就不赘述了... 直接看 代码吧

## 设置 输入框最大的长度
````swift
extension UITextField {

    /// Runtime 键
    private struct AssociatedKeys {
        
        static var maxlength: UInt8 = 0
        static var lastString: UInt8 = 0
    }
    
    /// 最大输入长度
    @IBInspectable var maxLength: Int {
        get {
            return objc_getAssociatedObject(self, &AssociatedKeys.maxlength) as? Int ?? 0
        }
        set(newValue) {
            objc_setAssociatedObject(self, &AssociatedKeys.maxlength, newValue, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC)
            addTarget(self, action: #selector(fix), for: .editingChanged)
        }
    }
    
    /// 最后一个符合条件的规则
    private var lastQualifiedString: String? {
        get {
            return objc_getAssociatedObject(self, &AssociatedKeys.lastString) as? String
        }
        set(newValue) {
            objc_setAssociatedObject(self, &AssociatedKeys.lastString, newValue, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        }
    }

    @objc func fix(textField: UITextField) {

        guard markedTextRange == nil else { return }

        /// 如果 个数 为最大个数
        /// 在字典中，保存 最大数据
        if textField.text?.count == maxLength {

            /// 在 字典中保存 该数值
            lastQualifiedString = textField.text

            // 在 小于个数时 清除 数据
        } else if textField.text?.count ?? 0 < maxLength {
            lastQualifiedString = nil
        }

        let editRange: UITextRange?

        /// 如果 输入框内的个数大于 最大值
        if textField.text?.count ?? 0 > maxLength {

            /// 将选中的 range 向前移动一个位置
            let position = textField.position(from: safeTextPosition(selectedTextRange?.start), offset: -1) ?? textField.beginningOfDocument

            editRange = textField.textRange(from: safeTextPosition(position), to: safeTextPosition(position))
        } else {

            editRange = selectedTextRange
        }

        /// 配置 值
        textField.text = textField.text?.safelyLimitedTo(length: maxLength, safeText: lastQualifiedString)

        textField.selectedTextRange = editRange
    }

    /// 安全获取  UITextPosition
    private func safeTextPosition(_ optionlTextPosition: UITextPosition?) -> UITextPosition {

        /* beginningOfDocument -> The end and beginning of the the text document. */
        return optionlTextPosition ?? self.beginningOfDocument
    }
}

extension String {

    /// 比较后 决定 返回 text 还是 safetext
    ///
    /// - Parameters:
    ///   - n: 长度
    ///   - safeText: 安全字符串
    /// - Returns: 返回的值
    fileprivate func safelyLimitedTo(length n: Int, safeText: String?) -> String? {
        if (self.count <= n) {
            return self
        }
        return safeText ?? String( Array(self).prefix(upTo: n) )
    }
}


````

舒服 😌～～～～～