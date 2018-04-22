

/*$.ajax({
    url: "/rank_station_data",    //请求的url地址
    dataType: "json",   //返回格式为json
    async: true, //请求是否异步，默认为异步，这也是ajax重要特性
    type: "GET",   //请求方式
    contentType: "application/json",
    data:{
        date:new Date(2016,0,1,7,0,0)
    },
    beforeSend: function () {//请求前的处理
    },
    success: function (rank_data, textStatus) {

        console.log(rank_data);

    },
    complete: function () {//请求完成的处理
    },
    error: function () {//请求出错处理
    }
});*/

function word_cloud() {
    var border = 1;
    var all_view = $("#all_view");
    var body_width = all_view.width();
    var body_height = all_view.height()-20;

    var width = (body_width * 0.15 - border);
    var height = (body_height * 0.45 );

    var radius = width/2;//3D 球的半径
    var dtr = Math.PI/180;
    var d=200;

    var mcList = [];
    var active = false;
    var lasta = 1;
    var lastb = 1;
    var distr = true;
    var tspeed=20;//文字移动速度
    var size=140;

    var mouseX=0;
    var mouseY=0;

    var howElliptical=1;

    var aA=null;
    var oDiv=null;

    function update() {

        var a;
        var b;

        if(active)
        {
            a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;
            b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
        }
        else
        {
            a = lasta * 0.98;
            b = lastb * 0.98;
        }

        lasta=a;
        lastb=b;

        if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
        {
            return;
        }

        var c=0;
        sineCosine(a,b,c);
        for(var j=0;j<mcList.length;j++)
        {
            var rx1=mcList[j].cx;
            var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa);
            var rz1=mcList[j].cy*sa+mcList[j].cz*ca;

            var rx2=rx1*cb+rz1*sb;
            var ry2=ry1;
            var rz2=rx1*(-sb)+rz1*cb;

            var rx3=rx2*cc+ry2*(-sc);
            var ry3=rx2*sc+ry2*cc;
            var rz3=rz2;

            mcList[j].cx=rx3;
            mcList[j].cy=ry3;
            mcList[j].cz=rz3;

            per=d/(d+rz3);

            mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2);
            mcList[j].y=ry3*per;
            mcList[j].scale=per;
            mcList[j].alpha=per;

            mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6);
        }

        doPosition();
        depthSort();
    }

    function depthSort() {
        var i=0;
        var aTmp=[];

        for(i=0;i<aA.length;i++)
        {
            aTmp.push(aA[i]);
        }

        aTmp.sort
        (
            function (vItem1, vItem2)
            {
                if(vItem1.cz>vItem2.cz)
                {
                    return -1;
                }
                else if(vItem1.cz<vItem2.cz)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
        );

        for(i=0;i<aTmp.length;i++)
        {
            aTmp[i].style.zIndex=i;
        }
    }

    function positionAll() {

        var phi=0;
        var theta=0;
        var max=mcList.length;
        var i=0;

        var aTmp=[];
        var oFragment=document.createDocumentFragment();


        for(i=0;i<aA.length;i++)
        {
            aTmp.push(aA[i]);
        }

        aTmp.sort
        (
            function ()
            {
                return Math.random()<0.5?1:-1;
            }
        );

        for(i=0;i<aTmp.length;i++)
        {
            oFragment.appendChild(aTmp[i]);
        }

        oDiv.appendChild(oFragment);

        for( var i=1; i<max+1; i++){
            if( distr )
            {
                phi = Math.acos(-1+(2*i-1)/max);
                theta = Math.sqrt(max*Math.PI)*phi;
            }
            else
            {
                phi = Math.random()*(Math.PI);
                theta = Math.random()*(2*Math.PI);
            }

            mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi);
            mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi);
            mcList[i-1].cz = radius * Math.cos(phi);

            //aA[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px';
            //aA[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px';
        }
    }

    function doPosition() {

        var l=oDiv.offsetWidth/2;
        var t=oDiv.offsetHeight/2;
        for(var i=0;i<mcList.length;i++)
        {
            aA[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px';
            aA[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px';
            //aA[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px';
            aA[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")";
            aA[i].style.opacity=mcList[i].alpha;
        }
    }

    function sineCosine( a, b, c) {

        sa = Math.sin(a * dtr);
        ca = Math.cos(a * dtr);
        sb = Math.sin(b * dtr);
        cb = Math.cos(b * dtr);
        sc = Math.sin(c * dtr);
        cc = Math.cos(c * dtr);
    }

    $(document).ready(function(){

        var oTag=null;

        var data=[{key:"建国门",val:29.153}, {key:"青义",val:29.546},{key:"圣水寺",val:40},{key:"西南科技大学北门",val:10},
            {key:"市肿瘤医院",val:29.153}, {key:"交警大队",val:29.546},{key:"高水",val:40},{key:"平政",val:10}];

        var cloud_div = d3.select("#message_cloud")
            .append("div")
            .attr("id","div1")
            .style({
                "position":"relative",
                "top":"55%"
                //"margin": "20px auto 0"
            })
            .attr("width",width)
            .attr("height",height);

         cloud_div.selectAll(".css")
            .data(data)
            .enter()
            .append("a")
            .style({
                "font-size":function(d){
                    return d.val + "px";},
                "fill":"#40b1ff",
                "position":"absolute",
                "font-family": "Microsoft YaHei",
                "color":"#0b85ff",
                "font-weight":"bold",
                "text-decoration":"none"
            })
            .text(function(d){return d.key});


        oDiv=document.getElementById('div1');
        aA=oDiv.getElementsByTagName('a');

        for(var i=0;i<aA.length;i++)
        {
            oTag={};
            oTag.offsetWidth=aA[i].offsetWidth;
            oTag.offsetHeight=aA[i].offsetHeight;
            mcList.push(oTag);
        }

        sineCosine( 0,0,0 );

        positionAll();

        oDiv.onmouseover=function ()
        {
            active=true;
        };

        oDiv.onmouseout=function ()
        {
            active=false;
        };

        oDiv.onmousemove=function (ev)
        {
            var oEvent=window.event || ev;

            mouseX=oEvent.clientX-(oDiv.offsetLeft+oDiv.offsetWidth/2);
            mouseY=oEvent.clientY-(oDiv.offsetTop+oDiv.offsetHeight/2);

            mouseX/=5;
            mouseY/=5;
        };

        setInterval(update, 30);
    });
}

word_cloud();