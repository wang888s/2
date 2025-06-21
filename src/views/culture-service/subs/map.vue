<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";
import "leaflet-echarts"
import "leaflet-echarts/lib/echarts.source"
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import * as echarts from 'echarts'
import * as turf from "@turf/turf";
import _ from 'lodash'

export default {
  props: {
    center: {
      type: Array,
      default: () => ([28.864413, 109.28949]),
    },
    mapData: {
      type: Array,
      default: () => ([]),
    },
    options: {
      type: Array,
      default: () => ([]),
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      calLayer: undefined,
      polyLayer: undefined,
      resLayer: undefined,
      geometry: undefined,
      baseVector: undefined,
      baseRaster: undefined,
      isDraw: false,
      zoom: 10,
      townLayer: undefined,
      historyMarker: undefined
    };
  },
  mounted: function () {
    let _this = this;
    _this.initMap(_this.$el);

    _this.map.on("pm:drawstart", () => {
      if (_this.calLayer) {
        _this.map.removeLayer(_this.calLayer);
      }
      if (_this.resLayer) {
        _this.map.removeLayer(_this.resLayer);
      }
      _this.calLayer = undefined;
      _this.geometry = undefined;
      _this.resLayer = undefined;
    });

    _this.map.on("pm:create", ({shape, layer}) => {
      _this.calLayer = layer;
      _this.geometry = _this.calLayer.toGeoJSON().geometry;
      console.log(_this.geometry);
      _this.$emit("drawEnd", _this.geometry);
      _this.isDraw = false;
    });

    _this.map.on("contextmenu", (e) => {
      e.preventDefault();
    });

    _this.map.on("mousedown", (e) => {
      if (e.originalEvent.button == 2 && _this.isDraw) {
        _this.map.pm.disableDraw();
        _this.isDraw = false;
      }
    });
  },
  methods: {
    initMap(el) {
      let _this = this;
      _this.map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0.5,
      }).setView(_this.center, this.zoom);
      _this.map.setMaxBounds([
        [-90, -180],
        [90, 180],
      ]);
    },

    setCenter(center, zoom) {
      this.map.setView(center, zoom ? zoom : 12);
    },

    setRegion(geojson) {
      // if (this.baseVector && this.map.hasLayer(this.baseVector)) {
      //     this.map.removeLayer(this.baseVector)
      // }
      // this.baseVector = L.geoJSON(geojson, {
      //     style: () => {
      //         return {fill: false}
      //     }
      // }).addTo(this.map)
      // this.map.fitBounds(this.baseVector.getBounds())
    },

    setBaseTile(url) {
      if (this.baseRaster && this.map.hasLayer(this.baseRaster)) {
        this.map.removeLayer(this.baseRaster);
      }
      const baseUrl = url.split("?")[0];
      const items = url.split("?")[1].split("&");
      var layers, bbox;
      items.forEach((item) => {
        const key = item.split("=")[0];
        const val = item.split("=")[1];
        if (key === "layers") {
          layers = decodeURIComponent(val);
        }
        if (key == "bbox") {
          const points = decodeURIComponent(val).split(",");
          bbox = [
            [points[1], points[0]],
            [points[3], points[2]],
          ];
        }
      });
      this.baseRaster = L.tileLayer
        .wms(baseUrl, {
          layers: layers,
          format: "image/png",
          transparent: true,
          crs: L.CRS.EPSG4326,
          tileSize: L.point(256, 256),
          bounds: bbox,
          maxZoom: 18,
          zIndex: 101,
        })
        .addTo(this.map);
      this.map.fitBounds(bbox);
    },

    setText(array) {
      array.forEach(item => {
        const center = turf.center(item)
        let [lng, lat] = center.geometry.coordinates
        if (item.properties.name === '青华林场') {
          lng = 108.902623
          lat = 28.73817
        }
        let marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'name',
            html: `<div>${item.properties.name}</div>`,
            iconSize: [80, 20]
          })
        })
        const that = this
        marker.on('click', function () {
          if (that.townLayer) {
            that.townLayer.remove()
          }
          that.townLayer = L.geoJSON(item, {
            style: function (feature) {
              return {
                color: "#FF0000",
                weight: 2,
                opacity: 1,
                fillOpacity: 0,
              };
            },
          }).addTo(that.map);

          if (that.historyMarker) {
            that.historyMarker.setIcon(L.divIcon({
              className: 'name',
              html: `<div>${that.historyMarker.data.properties.name}</div>`,
              iconSize: [80, 20]
            }))
          }
          marker.setIcon(L.divIcon({
            className: 'name active',
            html: `<div>${item.properties.name}</div>`,
            iconSize: [80, 20]
          }))
          that.historyMarker = marker
          that.historyMarker.data = item

          that.$emit('markClick', item)
        })
        marker.addTo(this.map);
      })
    },

    setBaseVecotrTile(url) {
      //var map = L.map("map").setView([28.840295, 108.745752], 12);
      // var tiandituLayer = L.tileLayer(
      //     "http://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=fa6763c0ee279a2a615a252848f5b54f",
      //     {
      //         subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      //         maxZoom: 16,
      //         minZoom: 5,
      //     }
      // ).addTo(this.map);
      // var tiandituAnnotion = L.tileLayer(
      //     "http://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=fa6763c0ee279a2a615a252848f5b54f",
      //     {
      //         subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      //         maxZoom: 16,
      //         minZoom: 10,
      //     }
      // ).addTo(this.map);
      var youyangGeoJSON = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: url.features[0].geometry.coordinates[0],
        },
        properties: {
          name: "酉阳县",
        },
      };
      // 添加酉阳县边界到地图
      var youyangLayer = L.geoJSON(url, {
        style: function (feature) {
          return {
            color: "rgba(26, 126, 221, 1)",
            weight: 2,
            opacity: 1,
            fillOpacity: 0,
          };
        },
      }).addTo(this.map);
      this.setText(url.features)
      // 裁剪地图，只显示酉阳县部分
      // L.maskLayer = L.Layer.extend({
      //     initialize: function (geojson, options) {
      //         this._geojson = geojson;
      //         this._options = options;
      //     },
      //     onAdd: function (map) {
      //         this._map = map;
      //         this._mapLayer = L.geoJSON(this._geojson, this._options).addTo(
      //             this._map
      //         );
      //         var bounds = this._mapLayer.getBounds();
      //         this._map.fitBounds(bounds);
      //         this._maskPane = this._map.getPane("overlayPane");
      //         this._maskPane.style.backgroundColor = "white";
      //         this._mapLayer.eachLayer(
      //             function (layer) {
      //                 var path = layer.getElement();
      //                 var clipPath = document.createElementNS(
      //                     "http://www.w3.org/2000/svg",
      //                     "clipPath"
      //                 );
      //                 var id = "clip-" + L.Util.stamp(layer);
      //                 clipPath.setAttribute("id", id);
      //                 var clonedPath = path.cloneNode(true);
      //                 clipPath.appendChild(clonedPath);
      //                 this._map.getPane("mapPane").appendChild(clipPath);
      //                 path.setAttribute("clip-path", "url(#" + id + ")");
      //             }.bind(this)
      //         );
      //     },
      //     onRemove: function (map) {
      //         this._map.getPane("overlayPane").style.backgroundColor = "";
      //         this._mapLayer.remove();
      //     },
      // });

      // var maskLayer = new L.maskLayer(youyangGeoJSON, {
      //     style: function (feature) {
      //         return {
      //             color: "red",
      //             fill: false, // 不显示填充
      //             weight: 2,
      //             opacity: 1,
      //             fillOpacity: 0.5,
      //             fillColor: "white",
      //         };
      //     },
      // }).addTo(this.map);
      // //添加遮罩层
      // var points = [];
      // console.log(url.features[0].geometry.coordinates[0]);
      // for (
      //     let i = 0;
      //     i < url.features[0].geometry.coordinates[0][0].length;
      //     i++
      // ) {
      //     points.push([
      //         url.features[0].geometry.coordinates[0][0][i][1],
      //         url.features[0].geometry.coordinates[0][0][i][0],
      //     ]);
      // }
      // var points1 = [];
      // points1.push(new T.LngLat(73.0, 59.0));
      // points1.push(new T.LngLat(73.0, 3.0));
      // points1.push(new T.LngLat(136.0, 3.0));
      // points1.push(new T.LngLat(136.0, 59.0));
      // points1.push(new T.LngLat(73.0, 59.0));
      // console.log(points);
      // var polygon = L.polygon([points, points1], {
      //     color: "#07406D",
      //     weight: 2,
      //     opacity: 1,
      //     fillOpacity: 0.8,
      //     fillColor: "#08122B",
      // }).addTo(this.map);

      //   if (this.baseVector && this.map.hasLayer(this.baseVector)) {
      //     this.map.removeLayer(this.baseVector);
      //   }
      //   const baseUrl = url.split("?")[0];
      //   const items = url.split("?")[1].split("&");
      //   var layers, bbox;
      //   items.forEach((item) => {
      //     const key = item.split("=")[0];
      //     const val = item.split("=")[1];
      //     if (key === "layers") {
      //       layers = val;
      //     }
      //     if (key == "bbox") {
      //       const points = val.split(",");
      //       bbox = [
      //         [points[1], points[0]],
      //         [points[3], points[2]],
      //       ];
      //     }
      //   });
      //   this.baseVector = L.tileLayer
      //     .wms(baseUrl, {
      //       layers: layers,
      //       format: "image/png",
      //       transparent: true,
      //       crs: L.CRS.EPSG4326,
      //       tileSize: L.point(256, 256),
      //       bounds: bbox,
      //       maxZoom: 18,
      //       zIndex: 102,
      //     })
      //     .addTo(this.map);
      // const mapPosition = L.map('map').setView([108.745752,28.840295], 13);

      // console.log('echartsLayer=========>')
      // console.log(L.echartsLayer)
      // const echartLayer = L.echartsLayer(this.map, echarts);
      // console.log(echartLayer)
      // var chartsContainer= echartLayer.getEchartsContainer();
      // var myChart = echartLayer.initECharts(chartsContainer);
      // echartLayer.setOption(option)
    },

    renderEcharts(url, isFirst = true) {
      for (let i = 0; i < url.features.length; i++) {
        const item = url.features[i]
        // console.log('url.features[i] =====>', item)
        const center = turf.center(item)
        const name = item.properties.name
        const currentData = this.mapData.find(child => child.label === name)
        const option = this.type === '' ? this.echartsPie(currentData) : this.echartsBar(currentData)
        let [lng, lat] = center.geometry.coordinates
        if (name === '青华林场') {
          lng = 108.902623
          lat = 28.73817
        }
        lat = lat + 0.04
        if(isFirst) {
          const mark = L.marker([lat, lng],
            {
              icon: L.divIcon({
                className: 'leaflet-echart-icon',
                iconSize: [80, 80],
                html: `<div id="cm${i}" class="cm"></div>`
              })
            }).addTo(this.map);
        }
        if(this[`echart${i}`]) {
          this[`echart${i}`].dispose()
          this[`echart${i}`] = null
        }
        const Chart1 = echarts.init(document.getElementById(`cm${i}`));
        Chart1.setOption(option);
        // Chart1.on('mouseover', function (params) {
        //   Chart1.dispatchAction({
        //     type: 'showTip',
        //     seriesIndex: 0,
        //     dataIndex: params.dataIndex
        //   });
        // });
        this[`echart${i}`] = Chart1
      }
    },

    startDrawPolygon(e) {
      e.stopPropagation();
      console.log(e);
      this.isDraw = true;
      this.map.pm.enableDraw("Polygon", {
        snappable: false,
        pathOptions: {fill: false},
        tooltips: false,
      });
    },

    startDrawRect(e) {
      e.stopPropagation();
      this.isDraw = true;
      this.map.pm.enableDraw("Rectangle", {
        snappable: false,
        pathOptions: {fill: false},
        tooltips: false,
      });
    },

    clearDraw() {
      if (this.calLayer) {
        this.map.removeLayer(this.calLayer);
      }
      if (this.resLayer) {
        this.map.removeLayer(this.resLayer);
      }

      this.calLayer = undefined;
      this.resLayer = undefined;
      this.geometry = undefined;
    },

    showResult(url) {
      if (this.calLayer) {
        this.map.removeLayer(this.calLayer);
      }
      if (!url) return;
      const baseUrl = url.split("?")[0];
      const items = url.split("?")[1].split("&");
      var layers, bbox;
      items.forEach((item) => {
        const key = item.split("=")[0];
        const val = item.split("=")[1];
        if (key === "layers") {
          layers = val.replace("%3A", ":");
        }
        if (key == "bbox") {
          const points = val.replace("%2C", ",").split(",");
          bbox = [
            [points[1], points[0]],
            [points[3], points[2]],
          ];
        }
      });
      this.calLayer = L.tileLayer
        .wms(baseUrl, {
          layers: layers,
          format: "image/png",
          transparent: true,
          crs: L.CRS.EPSG4326,
          tileSize: L.point(256, 256),
          bounds: bbox,
          maxZoom: 22,
          zIndex: 103,
          opacity: 0.6,
        })
        .addTo(this.map);
      this.map.fitBounds(bbox);
    },

    showPolygon(geojson, cb) {
      if (this.polyLayer && this.map.hasLayer(this.polyLayer)) {
        this.map.removeLayer(this.polyLayer);
      }
      this.polyLayer = L.geoJSON(geojson, {
        style: () => {
          return {fill: false};
        },
      }).addTo(this.map);

      cb && cb(this.polyLayer);
    },
    showUploadPolygon(geojson, cb) {
      this.geometry = geojson;
      if (this.calLayer && this.map.hasLayer(this.calLayer)) {
        this.map.removeLayer(this.calLayer);
      }
      this.calLayer = L.geoJSON(geojson, {
        style: () => {
          return {fill: false};
        },
      }).addTo(this.map);
      cb && cb(this.calLayer);
    },
    echartsBar(data) {
      let showData = []
      const arr = this.mapData.map(item => item[this.type])
      Object.keys(data).forEach(key => {
        if ([this.type].includes(key)) {
          const currentOption = this.options.find(item => item.key === key)
          const obj = {
            name: currentOption.name,
            value: data[key],
            itemStyle: {
              color: 'rgba(26, 126, 221, 1)'
            }
          }
          showData.push(obj)
        }
      })
      return {
        tooltip: {
          show: true,
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.63)', //设置背景颜色
          textStyle: {
            color: '#fff'
          },
          axisPointer: {
            type: 'shadow'
          },
          borderColor: "rgba(255,255,255, .5)",
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '5%',
          containLabel: true
        },
        legend: {
          show: false,
        },
        xAxis: {
          data: showData.map(item => item.name),
          axisLabel: {show: false},
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {show: false}
        },
        yAxis: {
          max: _.max(arr),
          axisLabel: {show: false},
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {show: false}
        },
        series: [{
          name: '',
          type: 'bar',
          data: showData,
          barWidth: 30,
          label: {
            show: true,
            textStyle: {
              color: '#fff'
            },
            formatter: (params) => params.value
          },
        }]
      };
    },
    echartsPie(data) {
      let keyValue = this.options.map(item => item.key)
      let showData = []
      Object.keys(data).forEach(key => {
        if (keyValue.includes(key)) {
          const currentOption = this.options.find(item => item.key === key)
          const obj = {
            name: currentOption.name,
            value: data[key]
          }
          showData.push(obj)
        }
      })
      return {
        // title: {
        //   text: 'Referer of a Website',
        //   subtext: 'Fake Data',
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.63)', //设置背景颜色
          textStyle: {
            color: '#fff'
          },
          axisPointer: {
            type: 'shadow'
          },
          borderColor: "rgba(255,255,255, .5)",
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          show: false
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            label: {show: false},
            data: showData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    }
  },
};
</script>

<style lang="less" scoped>
#map {
  width: 100vw;
  height: calc(~"100vh");
  background: rgba(0, 0, 0, 0);
  margin: 0 auto;

  /deep/ .name {
    color: #fff;
    font-size: 14px;
    line-height: 22px;
    height: 22px !important;
    padding: 0 5px;
    background-color: #0d7ec5;
    border-radius: 6px;

    &.active {
      background-color: red;
    }
  }

  /deep/ .cm {
    width: 80PX;
    height: 80PX;
    position: relative;
    background-color: transparent;
    z-index: 999;
  }
}
</style>
