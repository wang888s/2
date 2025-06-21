<template>
  <div id="map" :class="{'hide-name': hideName}"></div>
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
import axios from "axios";
import service from "@/api";
import landList from "views/landTransfer/subs/landList/index.vue";
import {regionnumDict, ecoDLBMDict, YRTDSMHZKDict} from './dict'

export default {
  props: {
    center: {
      type: Array,
      default: () => ([29.4071733136643, 109.31647493832519]),
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
    },
    hideName: {
      type: Boolean,
      default: false
    },
    mapClick: {
      type: Boolean,
      default: false
    },
    outputRes: {
      type: String,
      default: ''
    },
    isCustomizeClickEvent: {
      type: Boolean,
      default: false
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
      historyMarker: undefined,
      modelValue: {}
    };
  },
  mounted: function () {
    let _this = this;
    _this.initMap(_this.$el);

    const getFeatureInfoUrl = (map, latlng) => {
      // 根据你的WMS服务和参数修改以下URL构造过程
      var point = map.latLngToContainerPoint(latlng, map.getZoom())
      let size = map.getSize()
      let params = {
        service: 'WMS',
        version: '1.1.1', //这里是对应你的服务版本每个服务都会不同
        request: 'GetFeatureInfo',
        format: 'image/jpeg',
        transparent: true,
        query_layers: this.outputRes || 'youyang:zjut_gep_map_calcres_1728226354', //图层服务名
        styles: '',
        layers: this.outputRes || 'youyang:zjut_gep_map_calcres_1728226354',//图层服务名
        exceptions: 'application/json',
        info_format: 'application/json',
        feature_count: 50,
        srs: 'EPSG:4326',
        x: 50,
        y: 50,
        width: 101,
        height: 101,
        // width: size.x,
        // height: size.y,
        bbox: map.getBounds().toBBoxString(),
      };
      // params[map.getCenter().lat < 0 ? 'i' : 'x'] = point.x;
      // params[map.getCenter().lng < 0 ? 'j' : 'y'] = point.y;
      // params[map.getCenter().lat < 0 ? 'i' : 'x'] = latlng.lat;
      // params[map.getCenter().lng < 0 ? 'j' : 'y'] = latlng.lng;
      // console.log('params====>', params);
      // let mapUrl = 'http://120.26.15.133:8086/geoserver/youyang/wms'
      let mapUrl = '/youyang/wms'
      let url = mapUrl + L.Util.getParamString(params, mapUrl, true);
      // console.log('url====>', url);
      return url
    }

    if (this.mapClick) {
      _this.map.on('click', async (e) => {
        console.log(e)
        if (this.isCustomizeClickEvent) {
          this.$emit('customizeClickEvent')
        }
        if (!this.outputRes || this.outputRes === '') {
          return
        }
        const url = getFeatureInfoUrl(this.map, e.latlng);
        const res = await service("get", url, {}, "geoserver");
        console.log(res)
        if (res.features && res.features.length > 0) {
          const [feature] = res.features;
          let id = ''
          if (feature.id) {
            const idArr = feature.id.split('.')
            id = feature.properties.regionnum + '-' + idArr[idArr.length - 1];
          } else {
            id = '-'
          }
          let popup = L.popup()
            .setLatLng(L.latLng(e.latlng.lat, e.latlng.lng))
            .setContent(`<div class="leaflet-map-popup popup">
<div class="popup-item"><div class="popup-item__label">地块名称：</div><div class="popup-item__value">${this.modelValue.projectName}</div></div>
<div class="popup-item"><div class="popup-item__label">地块编号：</div><div class="popup-item__value">${this.modelValue.id}</div></div>
<div class="popup-item"><div class="popup-item__label">地块面积：</div><div class="popup-item__value">${(feature.properties.Shape_Area).toFixed(2)}平方米</div></div>
<div class="popup-item"><div class="popup-item__label">地块生态类型：</div><div class="popup-item__value">${this.getDict('ecoDLBM', feature.properties.ecoDLBM)}</div></div>
<div class="popup-item"><div class="popup-item__label">核算总量：</div><div class="popup-item__value">${(this.modelValue.tiaojie_jz).toFixed(2)}元</div></div>
</div>`)
            .openOn(this.map);
          this.$emit('mapLayerClick', feature)
        }
      })
    }

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
    updateValue(model) {
      this.modelValue = model
    },
    getDict(key, value) {
      if (key === 'YRTDSMHZK') {
        return YRTDSMHZKDict[value]
      } else if (key === 'regionnum') {
        return regionnumDict[value]
      } else if (key === 'ecoDLBM') {
        return ecoDLBMDict[value] || '-'
      }
    },
    initMap(el) {
      let _this = this;
      _this.map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0.2,
      }).setView(_this.center, this.zoom);
      _this.map.setMaxBounds([
        [-90, -180],
        [90, 180],
      ]);
    },

    setCenter(center, zoom) {
      this.map.setView(center, zoom ? zoom : 12);
    },
    flyTo(center, zoom) {
      this.map.flyTo(center, zoom ? zoom : 12);
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
      console.log(array, 'array ==> ')
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
          if (that.historyMarker && that.historyMarker.data.properties.name === item.properties.name) {
            that.townLayer = L.geoJSON(item, {
              style: function (feature) {
                return {
                  color: "rgba(26, 126, 221, 1)",
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0,
                };
              },
            }).addTo(that.map);
            marker.setIcon(L.divIcon({
              className: 'name',
              html: `<div>${item.properties.name}</div>`,
              iconSize: [80, 20]
            }))
          } else {
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
            marker.setIcon(L.divIcon({
              className: 'name active',
              html: `<div>${item.properties.name}</div>`,
              iconSize: [80, 20]
            }))
          }

          if (that.historyMarker) {
            that.historyMarker.setIcon(L.divIcon({
              className: 'name',
              html: `<div>${that.historyMarker.data.properties.name}</div>`,
              iconSize: [80, 20]
            }))
          }
          that.historyMarker = marker
          that.historyMarker.data = item

          that.$emit('markClick', item)
        })
        marker.addTo(this.map);
      })
    },
    // 添加景区文字
    setScenicSpotText(array) {
      array.forEach(item => {
        if (item.location) {
          const [lng, lat] = item.location.split(',')
          let marker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'scenic-spot',
              html: `<div>
                        <div class="scenic-spot__img"></div>
                        <div class="scenic-spot__name">${item.name}</div>
             </div>`,
              iconSize: [80, 20]
            })
          })
          const that = this
          marker.on('click', function () {
            that.$emit('markScenicSpotClick', item)
          })
          marker.addTo(this.map);
        }
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
        if (!currentData) return
        const option = this.type === '' ? this.echartsPie(currentData) : this.echartsBar(currentData)
        let [lng, lat] = center.geometry.coordinates
        if (name === '青华林场') {
          lng = 108.902623
          lat = 28.73817
        }
        lat = lat + 0.05
        if (isFirst) {
          const mark = L.marker([lat, lng],
            {
              icon: L.divIcon({
                className: 'leaflet-echart-icon',
                iconSize: [80, 80],
                html: `<div id="cm${i}" class="cm"></div>`
              })
            }).addTo(this.map);
        }
        if (this[`echart${i}`]) {
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
      if (!url) return;
      const baseUrl = url.split("?")[0];
      const items = url.split("?")[1].split("&");
      var layers, bbox;
      try {
        items.forEach((item) => {
          const key = item.split("=")[0];
          const val = item.split("=")[1];
          if (key === "layers") {
            layers = val.replace("%3A", ":");
          }
          if (key == "bbox") {
            if (val === '') {
              this.$message.error('当前数据异常，请检查是否核算成功！')
              throw new Error('当前数据异常，请检查是否核算成功')
            }
            const points = val.replace("%2C", ",").split(",");
            bbox = [
              [points[1], points[0]],
              [points[3], points[2]],
            ];
          }
        });
        if (this.calLayer) {
          this.map.removeLayer(this.calLayer);
        }
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
      } catch (e) {

      }
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
              color: 'rgb(74,0,131)'
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
          barWidth: 20,
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#fff',
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
        color: [
          '#11A8FF',
          '#03D287',
          '#F2E439',
          '#EB8C39',
          'rgba(247, 87, 87, 1)',
          'rgba(25, 209, 249, 1)',
          'rgba(255, 253, 105, 1)',
          'rgba(8, 134, 249, 1)',
          'rgba(223, 52, 255, 1)',
          'rgba(255, 52, 52, 1)',
          'rgba(25, 206, 255, 1)',
        ],
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
  //width: 100vw;
  //height: calc(~"100vh");
  width: 1059px * 1.2;
  height: 842px * 1.2;
  background: rgba(0, 0, 0, 0);
  margin: 0 auto;

  /deep/ .leaflet-popup-tip-container {
    width: 24px;
    margin-left: -12px;
  }

  /deep/ .leaflet-popup-content-wrapper {
    border-radius: 4px;
    background-color: rgba(0, 24, 62, 0.6);
    color: #fff;
    margin: -5px auto 0;
  }

  /deep/ .leaflet-popup-tip {
    background-color: rgba(0, 24, 62, 0.6);
    width: 12px;
    height: 12px;
  }

  /deep/ .leaflet-popup-close-button {
    width: 32px;
    height: 32px;
    color: #fff;
  }

  /deep/ .leaflet-map-popup {
    .popup-item {
      font-size: 14px;
      display: flex;

      .popup-item__label {
        width: 120px;
        text-align: right;
      }
    }
  }

  &.hide-name {
    /deep/ .name {
      display: none;
    }
  }

  /deep/ .name {
    color: #fff;
    font-size: 12px;
    line-height: 22px;
    height: 22px !important;
    padding: 0 2px;
    background-color: #0d7ec5;
    border-radius: 6px;

    &.active {
      background-color: red;
      display: inline-block;
    }
  }

  /deep/ .scenic-spot {
    .scenic-spot__img {
      background: url("./icon-scenic-spot.png") no-repeat 0 0;
      width: 20px;
      height: 20px;
      background-size: cover;
      margin: 0 auto;
    }

    .scenic-spot__name {
      color: #fff;
      font-size: 12px;
      line-height: 22px;
      height: 22px !important;
      padding: 0 2px;
      background-color: #0d7ec5;
      border-radius: 6px;
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
