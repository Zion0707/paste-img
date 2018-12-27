/**
 * 
 * 截图/拖拽上传外设插件
 * paramObj{
 *      @param divName //截图放置框名称
 *      @param listClassName //被触发的文件名(单个，或多个) * 
 *      @param paramList //页面参数列表
 *      @param saveCallback //完成的回调函数
 * }
 *  */ 
function pasteImg(paramObj){
    
    //收纳文件框
    var receiveBox = document.querySelector(paramObj.divName);

    //给文件赋予功能
    var fileAddEvent = function(e){

        var fileType = e.target.result.split(';')[0];
        var img = new Image();
        img.id='imgid_'+ Date.parse(new Date()) + sum(1,100000000);
        img.className = 'paste-img-class';

        if( fileType.indexOf('image') != -1 ){
            //图片文件
            img.src = e.target.result;
            img.setAttribute('data-realtype', 'image');
        }else{
            //非图片文件
            img.src = 'file_icon.png';
            img.setAttribute('data-realtype', 'file');
        }
        //设置真实路径给提交
        img.setAttribute('data-realpath', e.target.result);
        receiveBox.appendChild( img );
        //设置拖拽功能
        pasteDrag('#'+img.id);
        //去除文字提示
        $('.tvupfile-paste-prompt').hide();
    }

    var imgReader = function( item ){
        var blob = item.getAsFile(),
        reader = new FileReader();
        reader.onload = function( e ){
            fileAddEvent(e);
        };
        reader.readAsDataURL( blob );
    };
    
    
    //文件拖拽功能
    receiveBox.ondragover=function (e){
        e.preventDefault();
        receiveBox.className='inClass';
    }
    receiveBox.ondragleave=function(e){
        e.preventDefault();
        receiveBox.className='';
    }
    receiveBox.ondrop=function (e){
        e.preventDefault();
        receiveBox.className='';
        // console.log(e.dataTransfer.files[0]);
        for( let i = 0, len=e.dataTransfer.files.length; i < len ; i++){
            var f=e.dataTransfer.files[i];//获取到第一个上传的文件对象
            var fr=new FileReader();//实例FileReader对象
            fr.readAsDataURL(f);//把上传的文件对象转换成url
            fr.onload=function (e){
                fileAddEvent(e);
            }
        }

    }


    //粘贴框触发粘贴事件
    receiveBox.addEventListener('paste', function( e ){
        //window.clipboardData.getData("Text") ie下获取黏贴的内容 e.clipboardData.getData("text/plain")火狐谷歌下获取黏贴的内容
        //alert(e.clipboardData.getData("text/plain") )
        var clipboardData = e.clipboardData,//谷歌
            i = 0,
            items, item, types;
            console.log('0')

        if( clipboardData ){
            console.log('1')
            items = clipboardData.items;
            if( !items ){
                console.log(2)
                return;
            }
            console.log(3)
            item = items[0];
            types = clipboardData.types || [];
            for( ; i < types.length; i++ ){
                if( types[i] === 'Files' ){
                    item = items[i];
                    break;
                }
            }
            if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
                imgReader( item );
            }
        }
    },false);


    //删除键触发去除聚焦的截图
    document.onkeydown=function(e){
        if( document.querySelector('.paste-img-out') ){ 
            console.log(e.keyCode);
            if( e && e.keyCode == 8 || e && e.keyCode == 46 ){ 
                receiveBox.removeChild(document.querySelector('.paste-img-out'));
                if($('#pasteImg img').length ==0){
                    $('.tvupfile-paste-prompt').show();
                }
            }
        }
    }

    //延时函数变量设定
    var fileTimer = null;

    //要上传的参数
    var maskParam = {
        upfileIndex:'',//触发的文件索引
        paramList: paramObj.paramList,//参数列表
    };

    //动态设定白色框尺寸，来适应各个业务的上传框大小
    $('.paste-area').css({
        width: $(paramObj.listClassName).eq(0).width(),
        height: $(paramObj.listClassName).eq(0).height()
    });

    //上传框被触发的时候
    $('body').on('mouseover',paramObj.listClassName,function(){
        //这里必须得有个文件标识，这样才能找到对应的图片
        maskParam.upfileIndex = $(this).index();
        console.log('上传的文件索引', maskParam.upfileIndex);

        clearTimeout(fileTimer);        
        $(this).addClass('paste-up');
        var offsetLeft = $(this).offset().left -10;
        var offsetTop = $(this).offset().top   -10;
        $('.tvupfile-wrap').css({
            left: offsetLeft,
            top: offsetTop
        }).show();
    });
    //离开上传输入框的时候
    $('body').on('mouseout',paramObj.listClassName,function(){
        $(this).removeClass('paste-up');
        fileTimer = setTimeout(function(){
            $('.tvupfile-wrap').hide();
            clearTimeout(fileTimer);
        },300);
    });
    //滚动条滚动的时候
    $('body').scroll(function(){
        if($('.paste-up').get(0)){
            var offsetLeft = $('.paste-up').offset().left -10;
            var offsetTop = $('.paste-up').offset().top   -10;
            $('.tvupfile-wrap').css({
                left: offsetLeft,
                top: offsetTop
            });
        }
    });

    //白色外边框触发事件    
    $('.tvupfile-wrap a').on('mouseover',function(){
        clearTimeout(fileTimer);        
    });
    $('.tvupfile-wrap a').on('mouseout',function(){
        clearTimeout(fileTimer);        
        $('.tvupfile-wrap').hide();
    }); 
    

    //触发弹框
    $('#pasteBtn').on('click',function(){
        $('.tvupfile-paste-wrap').fadeIn();
        $('.tvupfile-paste-prompt').show();
    });
    //关闭弹窗
    $('#pasteClose').on('click',function(){
        $('.tvupfile-paste-wrap').fadeOut();
        $('#pasteImg').html('');
    });

    //提交信息
    $('#pasteImgUpbtn').on('click',function(){

        //判断框内是否有文件
        if( $('#pasteImg img').length ){
            if( $('#pasteImg img').length > 1 ){
                //多个文件的操作(打包成压缩包)
                for(let i = 0, len = $('#pasteImg img').length ; i < len ; i++ ){
                    if( $('#pasteImg img').eq(i).attr('data-realtype') == 'file' ){
                        alert('不能合并多个文件');
                        return;
                    }
                }
                
                //多个图片的操作(合并成一张图片)
                var imgsData =[];
                var imgswArr = [];
                var maxHeight = 0;
                for( let i = 0, len = $('#pasteImg img').length; i< len ;i++){
                    var img = new Image();
                    img.src = $('#pasteImg img').eq(i).attr('data-realpath');
                    img.onload = function(e){
                        imgsData.push({
                            width: this.width,
                            height: this.height,
                            src: this.src,
                        });
                        imgswArr.push(this.width);
                        maxHeight+=this.height;
                        //所有数据获取到的时候
                        if( imgsData.length >= len ){
                            getImgsData({
                                maxWidth: max(imgswArr), //最大宽度
                                maxHeight: maxHeight, //最长高度
                                list: imgsData
                            });
                        }
                    }
                }

                //获取图片信息来组合成一大张图
                function getImgsData(res){
                    console.log(res);
                    var canvas = document.createElement('canvas');
                    canvas.width = res.maxWidth + 40; //给图片预留 40 边距
                    canvas.height = res.maxHeight + (res.list.length+1) * 20; //给每张图片预留 20边距
                    var ctx = canvas.getContext('2d');
                    ctx.rect(0 , 0 , canvas.width , canvas.height);
                    ctx.fillStyle = "#fff";
                    ctx.fill();

                    var distance = 20;
                    for(let i =0, len = res.list.length ; i < len ; i++ ){
                        var img = new Image();
                        //img.crossOrigin = 'Anonymous'; //解决跨域
                        img.src = res.list[i].src;
                        img.onload = function(e){
                            //把图片画入到canvas中
                            ctx.drawImage(this, 20, distance, res.list[i].width, res.list[i].height);
                            distance+=res.list[i].height + 20 ;

                            //图片都铺满的时候
                            if( i >= len -1 ){
                                var base64Realpath = canvas.toDataURL('image/jpeg');
                                var base64Realtype = 'image';
                                canvasComplete(base64Realpath, base64Realtype);
                            }
                        }
                    }
                }
            }else{
                //一个文件的操作,获取第一个文件真实base64路径
                var base64Realpath = $('#pasteImg img').eq(0).attr('data-realpath');
                var base64Realtype = $('#pasteImg img').eq(0).attr('data-realtype');
                canvasComplete(base64Realpath, base64Realtype);
            }

            //canvas完成执行的函数
            function canvasComplete(base64Realpath, base64Realtype){
                //回调函数
                paramObj.saveCallback({
                    base64Realpath: base64Realpath, //真实路径
                    base64Realtype: base64Realtype, //真实文件类型 (image/file)
                    upfileIndex: maskParam.upfileIndex //上传框索引
                });
                //设置图片显示
                $(paramObj.listClassName).eq(maskParam.upfileIndex).addClass('tvfileup-hasimg');
                //还原设置
                $('#pasteLoading').hide();
                $('#pasteImg').html('');
                $('.tvupfile-paste-prompt').show();
                $('.tvupfile-paste-wrap').hide();
            }
        }else{
            alert('框内至少要有一个文件！');
        }
    });

    //去除选中功能
    $('.tvupfile-paste-wrap').on('click',function(){
        rmEdImgClass();
    });

}



//图片变大变小功能
function pasteDrag(dragObj){
    var dragObj = document.querySelector(dragObj);

    //图片鼠标按下的时候
    dragObj.onmousedown = function(e){
           e = e||event;
           var dir = "";  //设置好方向
           var firstX = e.clientX;  //获取第一次点击的横坐标
           var firstY = e.clientY;   //获取第一次点击的纵坐标
           var width = dragObj.offsetWidth;  //获取到元素的宽度
           var height = dragObj.offsetHeight;  //获取到元素的高度
           var Left = dragObj.offsetLeft;   //获取到距离左边的距离
           var Top = dragObj.offsetTop;   //获取到距离上边的距离
           //下一步判断方向距离左边的距离+元素的宽度减去自己设定的宽度，只要点击的时候大于在这个区间，他就算右边
           if(firstX>Left+width-30)
           {
               dir = "right";
           }else if(firstX<Left+30)
           {
               dir = "left";
           }
           if(firstY>Top+height-30)
           {
               dir = "down";
           }else if(firstY<Top+30)
           {
               dir = "top";
           }
           //判断方向结束
           document.onmousemove = function(e){
                //如果没有聚焦那么不予许缩放
               if( dragObj.getAttribute('class').indexOf('paste-img-out') == -1 ) return;

               e = e||event;
               switch(dir)
               {
                   case "right":
                         dragObj.style["width"] = width+(e.clientX-firstX)+"px";
                        break;
                   case "left":
                       dragObj.style["width"] = width-(e.clientX-firstX)+"px";
                       dragObj.style["left"] = Left+(e.clientX-firstX)+"px";
                        break;
                   case "top":
                       dragObj.style["height"] = height-(e.clientY-firstY)+"px";
                       dragObj.style["top"] = Top+(e.clientY-firstY)+"px";
                       break;
                   case "down":
                       dragObj.style["height"] = height+(e.clientY-firstY)+"px";
                       break;
               }
           }
           dragObj.onmouseup = function(){
               document.onmousemove = null;
           }
           return false;
    }

    //当前截图点击触发，点击就添加聚焦效果
    dragObj.onclick = function(e){
        e.stopPropagation();
        rmEdImgClass();
        this.className = 'paste-img-class paste-img-out';
    }
}


//去除不相关的class
function rmEdImgClass(){
    //所有截图区域中的图片
    var edImgClass = document.querySelectorAll('.paste-img-class');
    if( edImgClass ){
        for( var i = 0, len = edImgClass.length ; i < len ; i++ ){
            edImgClass[i].className = 'paste-img-class';
        }
    }
}

//随机数生成
function sum (m,n){
　  var num = Math.floor(Math.random()*(m - n) + n);
    return num;
}

//获取数组中最大的值
function max(arr){
    var num = arr[0];
    for(var i=0;i<arr.length;i++){
        if(num < arr[i]){
            num = arr[i]
        }
    }
    return num;
}