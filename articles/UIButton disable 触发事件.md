---
categories: IOS
title: UIButton disable 点击事件
tags:
  - IOS
  - RxSwift
  - runtime
date: 2018-12-04 10:25:00
---

2018年就这样要结束了，忙碌了一年...

2018年上半年几乎没有任何产出，都是在学习区块链相关。倒是学习了很多，受益匪浅。前段时间，比特币崩盘，也印证了我的猜想。

本身比特币就是一次实验，被人可以的搞成了一次“投资”？还真有人信。当然，我TM要是早点知道，这个玩意，我也信，韭菜真香…………………… 

一直到了，9月底，才迎来了一个项目。接下来的几天，我会整理一下，在开发这个款软件遇到的问题，以及解决方式，也算是为我的2018，来个收尾。

<!-- more -->

今天，先来一个比较好玩的需求。。。。

我们的设计，找到我

> 我们希望一个按钮，有不可用状态。当用户输入名称不可用的时候，就不可点击。但是我们希望这个在不可点击的状态下，被用户点击的时候，会 toast 一个提示，告诉他不可使用的原因

![](/publicFiles/emoticons/强颜欢笑.jpeg "笑着活下去")

行吧，想想确实也是需要的，因为我们的软件，有非常多的输入项，是一个表单。

那就做吧

## 使用自定义 UIButton

自定义一个Button视图

````swift

class CustomButton: UIButton{
    
    /// 存储属性
    private var _isEnabled = false{
        didSet{
            configureStyleMethod(_isEnabled)
        }
    }
    
    /// 是否可用
    override var isEnabled: Bool{
        set{
            if _isEnabled == newValue { return }
            _isEnabled = newValue
        }
        get{
            return _isEnabled
        }
    }
    
    /// 配置 样式
    private func configureStyleMethod(_ isEnabled: Bool){
        
        if isEnabled {
            
            /// set 可用状态样式
        }else{
            
            /// set 不可用状态样式
        }
    }
}
````

这样在按钮点击的时候，判断这个按钮的 isEnabled，如果不可用。这样子肯定是可以实现的，但是每次触发事件就会很麻烦

## 使用 runtime 修改

以下的方法使用的是，我项目中使用的方法

````swift
import UIKit

import RxCocoa
import RxSwift

/**
 本扩展主要为了 让UIButton 在 isEnabled 为 fasle 的情况下
 仍然可以监视该 UIButton 的
 */
extension UIControl {

    /// Runtime 键
    private struct AssociatedKeys {
        static var toggleState: UInt8 = 0
    }

    /// 获取一个 不可点击事件儿
    /// 如果该值没有 保存进入 UIButton
    /// 如果该值 有  获取 保存
    private var disablePublishSubject: PublishSubject<()> {
        if let value = objc_getAssociatedObject(self, &AssociatedKeys.toggleState) as? PublishSubject<()> { return value }
        let value = PublishSubject<()>()
        objc_setAssociatedObject(self, &AssociatedKeys.toggleState, value, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        return value
    }

    /// 不可点击状态点击时 触发的时间流 对象
    var disableObservable: Observable<()> {
        return self.disablePublishSubject.debounce(0.3, scheduler: MainScheduler.instance)
    }

    /// 点击事件儿 触发区域配置
    ///
    open override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {

        if !self.isEnabled && self.point(inside: point, with: event) {
            disablePublishSubject.onNext(()) //
            return self
        }
        return super.hitTest(point, with: event)
    }
}

````

`disablePublishSubject` 可以使用 block 来替换现在的rxswift。

这种方法使用起来就很简单，直接调用就可以的。

````swift
/// 提交按钮不可点击状态下，点击时
/// 在应用内提示为什么不可点击
submitButton.disableObservable.  // - next
````

但是有一个缺点，因为触发的方法，在 hitTest 就触发了，也就是刚触摸到就触发。。。暂时还没有比较好的处理办法

