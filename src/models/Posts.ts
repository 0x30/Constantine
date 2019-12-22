/* eslint-disable */

import { Post } from "./Post";

const post_7 = () => import("../../articles/测试.md")
const post_0 = () => import("../../articles/分布网络-共识算法.md")
const post_4 = () => import("../../articles/大话数据结构-树.md")
const post_1 = () => import("../../articles/大话数据结构-串.md")
const post_3 = () => import("../../articles/大话数据结构-栈与队列.md")
const post_6 = () => import("../../articles/大话数据结构-线性表.md")
const post_5 = () => import("../../articles/大话数据结构-算法.md")
const post_2 = () => import("../../articles/大话数据结构-数据结构绪论.md")

const tags = {"大数据": [post_7],"hadoop": [post_7],"hive": [post_7],"区块链": [post_0],"p2p": [post_0],"consensus": [post_0],"数据结构": [post_4,post_1,post_3,post_6,post_5,post_2],"计算机基础": [post_4,post_1,post_3,post_6,post_5,post_2]} as unknown as {[key: string]: [Post]}

const categories = {"大数据": [post_7],"区块链": [post_0],"数据结构": [post_4,post_1,post_3,post_6,post_5,post_2]} as unknown as {[key: string]: [Post]}

const pages = [[post_7,post_0,post_4],[post_1,post_3,post_6],[post_5,post_2]] as unknown as [[Post]]

export { tags, categories, pages };
