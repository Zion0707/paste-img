**关于 pasteImg.js**
1. 背景：在业务中有用到该需求，所以把上传功能封装了一下。
2. 功能：截图粘贴、拖拽上传、单张/多张图片(合并成一张)、单个文件，上传功能。
3. 返回：base64 字符串


```
 * 插件可选参数
 * paramObj{
 *      @param divName //截图放置框名称（必填）
 *      @param listClassName //被触发的文件名(单个，或多个)（必填）
 *      @param simulationFileInput //模拟需要被触发上传的按钮 （必填）
 *      @param saveMaxWidth //多张图片生成一张图片的最大宽度
 *      @param beforeSaveCallback //上传前回调函数
 *      @param saveCallback //base64文件生成的回调函数
 * }
```
访问地址  https://zion0707.github.io/pasteImg/
