<template>
  <div>
    <div id="huzhouMap"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
// import huzhouMapJson from '../../../../assets/json/huzhou.json'
import { fontSize } from "@/utils/common";
const img2 = require("../../../../assets/images/common/icon-map-label.png");
const symbol = require("../../../../assets/images/common/symbol.png");
import service from "@/api";

export default {
  props: ["huzhouMapJson", "region", "mapData"],
  data() {
    return {};
  },
  methods: {
    initHZMap() {
      const geoCoordMap = {
        吴兴区: [120.040351, 30.714089],
        安吉县: [119.687136, 30.64169],
        德清县: [119.980019, 30.544398],
        南浔区: [120.3246, 30.778963],
        长兴县: [119.800372, 31.020944],
        南太湖新区: [120.123766, 30.94005],
      };
      // var customerBatteryCityData = [
      //     {name: "吴兴区", value: 1,fdl:'99%',tds:1,fds:101},
      //     {name: "安吉县", value: 1,fdl:'99%',tds:1,fds:101},
      // ]
      const customerBatteryCityData = this.mapData.map((item) => ({
        ...item,
        value: 1,
      }));
      console.log(customerBatteryCityData);

      // 动态计算柱形图的高度（定一个max）
      function lineMaxHeight() {
        const maxValue = Math.max(
          ...customerBatteryCityData.map((item) => item.value)
        );
        return 0.1;
      }
      // 柱状体的主干
      function lineData() {
        return customerBatteryCityData.map((item) => {
          return {
            coords: [
              geoCoordMap[item.name],
              [
                geoCoordMap[item.name][0],
                geoCoordMap[item.name][1] + item.value * lineMaxHeight(),
              ],
            ],
          };
        });
      }
      // 柱状体的顶部
      function scatterData() {
        return customerBatteryCityData.map((item) => {
          return [
            geoCoordMap[item.name][0],
            geoCoordMap[item.name][1] + item.value * lineMaxHeight(),
            item,
          ];
        });
      }
      // 柱状体的底部
      function scatterData2() {
        return customerBatteryCityData.map((item) => {
          return {
            name: item.name,
            value: geoCoordMap[item.name],
          };
        });
      }
      var coordsP = [
        [
          [119.612164, 30.660932],
          [119.698976, 30.576896],
          [119.654708, 30.661429],
        ],
      ];

      let se = coordsP.map((coords) => {
        return {
          type: "custom",
          renderItem: (params, api) => renderItem(params, api, coords),
          coordinateSystem: "geo",
          geoIndex: 0,
          data: [
            {
              property: {
                name: 1123,
              },
            },
          ],
          zlevel: 8,
        };
      });
      function renderItem(params, api, coords) {
        // if(params.context.rendered) return
        // params.context.rendered = true

        var points = [];
        for (var i = 0; i < coords.length; i++) {
          points.push(api.coord(coords[i]));
        }
        var color = api.visual("color");
        // console.log(points)
        // console.log(params.coordSys)
        // console.log({
        //     type: 'polygon',
        //     shape: {
        //         points: points
        //     },
        //     style: api.style({
        //         fill: color,
        //         stroke: echarts.color.lift(color)
        //     })
        // })
        return {
          type: "polygon",
          shape: {
            points: points,
          },
          style: api.style({
            fill: "transparent",
            // stroke: echarts.color.lift(color)
            stroke: color,
          }),
        };
      }
      const option = {
        geo: [
          {
            map: "huzhou",
            animationDurationUpdate: 0,
            zoom: 1,
            roam: true,
            aspectScale: 0.9,
            layoutSize: "95%",
            layoutCenter: ["50%", "50%"],
            // center: [120.093415, 30.900146],
            label: {
              formatter: (row) => {
                return row.name.replace(/浙江省湖州市/g, "");
              },
              show: true,
              color: "rgba(255,255,255, 1)",
              fontSize: fontSize(0.14),
            },
            itemStyle: {
              normal: {
                areaColor: {
                  type: "linear-gradient",
                  x: 0,
                  y: 400,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(0, 41, 97, 1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(17, 85, 175, 0.92)", // 50% 处的颜色
                    },
                  ],
                  global: true, // 缺省为 false
                },
                borderColor: "#4ecee6",
                borderWidth: 1,
              },
              emphasis: {
                areaColor: {
                  type: "linear-gradient",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(0, 225, 255, 0.49)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(63, 237, 180, 1)", // 50% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            select: {
              itemStyle: {
                areaColor: {
                  type: "linear-gradient",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(0, 225, 255, 0.49)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(63, 237, 180, 1)", // 50% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
              label: {
                show: true,
                color: "#fff",
                fontSize: fontSize(0.16),
                fontWeight: "bold",
              },
            },
            emphasis: {
              itemStyle: {
                areaColor: {
                  type: "linear-gradient",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(0, 225, 255, 0.49)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(63, 237, 180, 1)", // 50% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
              label: {
                show: true,
                color: "#fff",
                fontSize: fontSize(0.16),
                fontWeight: "bold",
              },
            },
            zlevel: 3,
          },
          {
            map: "huzhou",
            animationDurationUpdate: 0,
            aspectScale: 0.9,
            roam: true, // 是否允许缩放
            zoom: 1, // 默认显示级别
            layoutSize: "95%",
            layoutCenter: ["50%", "50%"],
            itemStyle: {
              normal: {
                borderColor: "rgba(63, 229, 236, 1)",
                borderWidth: 2,
                shadowColor: "#2C99F6",
                shadowOffsetY: 0,
                shadowBlur: 120,
                areaColor: "transparent",
              },
            },
            zlevel: 2,
            silent: true,
          },
          {
            map: "huzhou",
            animationDurationUpdate: 0,
            aspectScale: 0.9,
            roam: true, // 是否允许缩放
            zoom: 1, // 默认显示级别
            layoutSize: "95%",
            layoutCenter: ["50%", "51.5%"],
            itemStyle: {
              areaColor: "transparent",
              borderColor: "rgba(57, 73, 239, 0.76)",
              borderWidth: 1,
            },
            zlevel: 1,
            silent: true,
          },
        ],
        series: [
          // map
          {
            geoIndex: 0,
            showLegendSymbol: true,
            type: "map",
            animationDurationUpdate: 0,
            roam: true,
            label: {
              normal: {
                show: false,
                textStyle: {
                  color: "#fff",
                },
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff",
                },
              },
            },
            itemStyle: {
              normal: {
                borderColor: "#2ab8ff",
                borderWidth: 1.5,
                areaColor: "#12235c",
              },
              emphasis: {
                areaColor: "#2AB8FF",
                borderWidth: 0,
                color: "red",
              },
            },
            map: "huzhou", // 使用
            data: customerBatteryCityData,
            zlevel: 6,
            // data: this.difficultData //热力图数据   不同区域 不同的底色
          },
          //柱状体的主干
          {
            type: "lines",
            animationDurationUpdate: 0,
            zlevel: 5,
            effect: {
              show: false,
              symbolSize: 5, // 图标大小
            },
            lineStyle: {
              width: fontSize(0.14), // 尾迹线条宽度
              color: function (params) {
                return new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,129,255, 0)",
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 1)",
                    },
                  ],
                  false
                );
              },
              opacity: 1, // 尾迹线条透明度
              curveness: 0, // 尾迹线条曲直度
            },
            label: {
              show: 0,
              position: "end",
            },
            silent: true,
            data: lineData(),
          },
          // 柱状体的顶部
          {
            type: "scatter",
            coordinateSystem: "geo",
            animationDurationUpdate: 0,
            geoIndex: 0,
            zlevel: 5,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  var name = params.data[2].name;
                  var value = params.data[2].totalValue;
                  // var text = `{tline|${name}}:{fline|${value}}`
                  var text = `{tline|${name}}：{fline|${value}}`;
                  return text;
                },
                color: "#fff",
                rich: {
                  fline: {
                    // padding: [0, 25],
                    color: "#fff",
                    fontSize: fontSize(0.14),
                    fontWeight: 400,
                  },
                  tline: {
                    // padding: [0, 27],
                    color: "#fff",
                    fontSize: fontSize(0.14),
                  },
                },
              },
              emphasis: {
                show: true,
              },
            },
            itemStyle: {
              color: "#00FFF6",
              opacity: 1,
            },
            symbol: `image://${img2}`,
            symbolSize: [fontSize(2.21), fontSize(0.46)],
            symbolOffset: [0, -20],
            z: 999,
            data: scatterData(),
          },
          // 柱状体的底部
          {
            geoIndex: 0,
            zlevel: 4,
            type: "effectScatter",
            coordinateSystem: "geo",
            animationDurationUpdate: 0,
            rippleEffect: {
              scale: 5,
              brushType: "stroke",
            },
            showEffectOn: "render",
            label: {
              normal: {
                formatter: "{b}",
                position: "bottom",
                color: "#fff",
                fontSize: 12,
                distance: 10,
                show: false,
              },
            },
            symbol: `image://${symbol}`,
            symbolSize: [10, 5],
            itemStyle: {
              // color: '#F7AF21',
              color: "rgb(22,255,255, 1)",
              opacity: 1,
            },
            data: scatterData2(),
          },
          // 底部外框
          {
            type: "scatter",
            coordinateSystem: "geo",
            animationDurationUpdate: 0,
            geoIndex: 0,
            zlevel: 4,
            label: {
              show: false,
            },
            symbol: "circle",
            symbolSize: [1, 1],
            itemStyle: {
              color: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(22,255,255, 0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.75,
                    color: "rgb(22,255,255, 0)", // 100% 处的颜色
                  },
                  {
                    offset: 0.751,
                    color: "rgb(22,255,255, 1)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgb(22,255,255, 1)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
              opacity: 1,
            },
            silent: true,
            data: scatterData2(),
          },
          // ...se,
        ],
      };
      echarts.registerMap("huzhou", this.huzhouMapJson);
      const chartDom = document.getElementById("huzhouMap");
      const myChart = echarts.init(chartDom);
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      myChart.on("click", (params) => {
        console.log(params);
        this.$emit("mapClick", params);
      });

      myChart.on("georoam", function (params) {
        const option = myChart.getOption(); // 获得option对象
        if (params.zoom != null && params.zoom != undefined) {
          // 捕捉到缩放时
          option.geo[1].zoom = option.geo[0].zoom; //下层geo的缩放等级跟着上层的geo一起改变
          option.geo[2].zoom = option.geo[0].zoom; //下层geo的缩放等级跟着上层的geo一起改变
          option.geo[1].center = option.geo[0].center; //下层的geo的中心位置随着上层geo一起改变
          option.geo[2].center = option.geo[0].center; //下层的geo的中心位置随着上层geo一起改变
        } else {
          //捕捉到拖曳时
          option.geo[1].center = option.geo[0].center; //下层的geo的中心位置随着上层geo一起改变
          option.geo[2].center = option.geo[0].center; //下层的geo的中心位置随着上层geo一起改变
        }
        // myChart.dispatchAction({ //来用程序主动渲染选框
        // 	type: "restore",
        // });
        myChart.setOption(option); //设置option
      });
    },
  },
};
</script>

<style lang="less" scoped>
#huzhouMap {
  width: 100vw;
  min-height: calc(~"100vh - 100px");
  margin: 0 auto;
}
</style>