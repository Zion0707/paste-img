**关于 pasteImg.js**
1、背景：在业务中有用到该需求，所以把上传功能封装了一下。
2、功能：截图粘贴、拖拽上传、单张/多张图片(合并成一张)、单个文件，上传功能。
3、返回：base64 字符串Í


```
 * 插件可选参数
 * paramObj{
 *      @param divName //截图放置框名称
 *      @param listClassName //被触发的文件名(单个，或多个) * 
 *      @param simulationFileInput //模拟需要被触发上传的按钮 
 *      @param paramList //页面参数列表
 *      @param beforeSaveCallback //上传前回调函数
 *      @param saveCallback //完成的回调函数
 *      @param saveMaxWidth //生成的图片最大宽度
 * }
```
