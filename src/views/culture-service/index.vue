<template>
  <div class="page" @click="closeDialog" :class="{ fullscreen: isFullscreen }">
    <div class="page-container" ref="pageContainer">
      <div>
        <back :path="'/home/detail'"></back>
        <Left :open="openLeft" @toggle="toggleLeftHandler" :showToggleBtn="false">
          <div class="opera">
            <el-form class="statistic-form" inline>
              <el-form-item>
                <el-select
                  placeholder="请选择"
                  v-model="searchParams.type"
                  suffix-icon="CaretBottom"
                  @change="search"
                >
                  <el-option
                    v-for="(item, index) in options"
                    :key="index"
                    :label="item.name"
                    :value="item.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- <div class="map-logo">
                    <img src="../../assets/images/common/map-logo.png" alt="">
                </div> -->
          <section class="page-container__section">
            <page-title>文化服务总量</page-title>
            <total-amount-service-regulation ref="totalAmountServiceRegulation" :total="totalMaterialSupplyDataTotal"
                                             :dataList="totalMaterialSupplyDataList"></total-amount-service-regulation>
          </section>
          <section class="page-container__section mt-5">
              <page-title>景区列表</page-title>
              <scenic-spot-list :list="list" :item-id="scenicSpotSelectedId" @select="clickScenicSpotListHandle"></scenic-spot-list>
          </section>
        </Left>

        <!--                <div class="map">-->
        <!--                    <div class="map-wrapper">-->
        <!--                        <map-core ref="map"></map-core>-->
        <!--                    </div>-->
        <!--                </div>-->
        <div class="map">
          <div class="map-wrapper">
            <map-core ref="map"
                      :map-click="true" :output-res="outputRes"
                      :hide-name="true"
                      :mapData="dataTownList"
                      :type="searchParams.type"
                      :popupType="'VEP_wh'"
                      :options="options"
                      @markClick="markClickHandle"
                      @markScenicSpotClick="clickScenicSpotListHandle"
            ></map-core>
            <div class="map-legend">
              <div class="map-legend__item" v-for="(item, index) in legendList" :key="index">
                <div class="item">
                  <div class="item-rect" :style="`--legend-color: ${item.color}`"></div>
                  <div class="item-label">{{ item.label }}</div>
                  <!--                    <div class="item-percent">{{ getPercent(item) }}%</div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ds-dialog :show="showDetail" @close="showDetail = false" :property="currentWh"></ds-dialog>
<!--    <detail-modal :show="showDetail" :current="current" :type="searchParams.type" :currentTown="currentTown"></detail-modal>-->
  </div>
</template>

<script>
import pageTitle from "@/components/title";
import Left from "@/components/left";
import application from "../home/subs/application";
import mapCore from "../home/subs/map/index";
import service from "@/api";
import screenfull from "screenfull";
import youyangJson from "../../assets/json/xzq(1).json";
import TotalAmountServiceRegulation from './subs/total-amount-service-regulation'
import AreaStatisticProgress from './subs/area-statistic-progress'
import DetailModal from './subs/detail-modal'
import back from '@/components/back'
import ScenicSpotList from './subs/scenic-spot-list.vue'
import dsDialog from './subs/dialog'

export default {
  components: {
    pageTitle,
    application,
    mapCore,
    Left,
    TotalAmountServiceRegulation,
    AreaStatisticProgress,
    DetailModal,
    back,
    ScenicSpotList,
    dsDialog
  },
  data() {
    return {
      outputRes: '',
      projectList: [],
      applicationList: [
        // {name: '土地出让', value: '724563', percent: 17.2, path: '/home/detail/landTransfer'},
      ],
      newsList: [],
      openLeft: true,
      openRight: true,
      isFullscreen: false,
      year: 2024,
      statisticData: [],
      // 项目区域
      region: "四川省酉阳县",
      // region2: "四川省酉阳县",
      huzhouMapJson: {},
      mapData: [],
      showDialog: false,
      viewportWidth: 0,
      viewportHeight: 0,
      height: "",
      property: {},
      legendList: [
        // {label: 'EP', color: 'rgba(255, 94, 107, 1)'},
        // {label: 'GEP', color: 'rgba(255, 204, 2, 1)'},
        // {label: 'VEP', color: 'rgba(168, 64, 196, 1)'},
        // {label: "EP", color: "rgba(255, 94, 107, 1)"},
        // {label: "GEP", color: "rgba(255, 94, 107, 1)"},
        // {label: "VEP", color: "rgba(255, 94, 107, 1)"},
      ],
      projectLoading: false,
      typeOptions: [
        {label: "全部", value: ""},
        {label: "土地出让", value: "EP"},
        {label: "综合整治", value: "GEP"},
        {label: "经营开发", value: "VEP"},
      ],
      statisticType: "",
      options: [
        {
          name: '全部',
          key: '',
          value: ''
        },
        {
          name: '景观增值',
          key: 'lyKy',
          value: ''
        },
        {
          name: '休闲旅游',
          key: 'xxYq',
          value: ''
        },
      ],
      totalMaterialSupplyDataTotal: 0,
      totalMaterialSupplyDataList: [
        {
          name: '景观增值',
          key: 'lyKy',
          value: ''
        },
        {
          name: '休闲旅游',
          key: 'xxYq',
          value: ''
        },
      ],
      yyUrl: 'http://120.26.15.133:8086/geoserver/yancheng/wms?service=WMS&version=1.1.0&request=GetMap&layers=yancheng%3Atif2&bbox=108.30484503862074%2C28.321786534672015%2C109.32209268672895%2C29.411887000313076&width=716&height=768&srs=EPSG%3A4326&styles=&format=application/openlayers',
      dataTownList: [],
      showDetail: false,
      current: {},
      currentWh: {},
      currentTown: {},
      searchParams: {
        type: ''
      },
      colorList: [
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
      list: [],
      scenicSpotSelectedId: null
    };
  },
  computed: {
    totalValue() {
      return this.a.reduce((pre, cur, index) => {
        return pre + cur.value;
      }, 0);
    },
  },
  created() {
  },
  async mounted() {
    this.year = this.$route.query.year
    this.judgeCurrentScreen();
    window.addEventListener("resize", this.judgeCurrentScreen);
    // await this.getMapGeoJson();
    // this.getApp();
    // this.getMapProjectAreaGeoJson();
    this.init({type: "VEP", name: ""});
  },
  watch: {
    viewportHeight(new1, val) {
      console.log(new1, val);
      if (new1 > val && val != 0 && new1 == this.height) {
        console.log(111);
        // if (val == 0) {
        //   document.querySelector(".statistic-chart__bar").style.height =
        //     170 + "px";
        //   document.querySelector(
        //     ".statistic-chart__bar #statisticEchartsBar"
        //   ).style.height = 170 + "px";
        //   document.querySelector(".list-body").style.height = 200 + "px";
        //   document.querySelector(".news").style.height = 300 + "px";
        //   document.querySelector(".application").style.height = 300 + "px";
        // } else {
        //   document.querySelector(".statistic-chart__bar ").style.height =
        //     270 + "px";
        //   document.querySelector(
        //     ".statistic-chart__bar #statisticEchartsBar"
        //   ).style.height = 270 + "px";

        //   document.querySelector(".list-body").style.height = 250 + "px";

        //   document.querySelector(".news").style.height = 360 + "px";
        //   document.querySelector(".application").style.height = 360 + "px";
        // }
        // document.querySelector(".statistic-chart__bar ").style.height =
        //   270 + "px";
        // document.querySelector(
        //   ".statistic-chart__bar #statisticEchartsBar"
        // ).style.height = 270 + "px";
        //
        // document.querySelector(".list-body").style.height = 250 + "px";
        //
        // document.querySelector(".news").style.height = 360 + "px";
        // document.querySelector(".application").style.height = 360 + "px";
      } else {
        if (new1 > val && new1 == this.height) {
        }
        // document.querySelector(".statistic-chart__bar").style.height =
        //   170 + "px";
        // document.querySelector(
        //   ".statistic-chart__bar #statisticEchartsBar"
        // ).style.height = 170 + "px";
        // document.querySelector(".list-body").style.height = 200 + "px";
        // document.querySelector(".news").style.height = 280 + "px";
        // document.querySelector(".application").style.height = 300 + "px";
      }
      console.log("实时屏幕高度：", val, this.windowHeight);
      // console.log(document.querySelector(".statistic-chart__bar"));
    },
    // 监听页面宽度
    viewportWidth(val) {
      console.log("实时屏幕宽度：", val, this.windowHeight);
    },
    'searchParams.type': {
      handler (val) {
        const options = _.cloneDeep(this.options)
        if(val && val !== '') {
          // 柱状图图例
          const item = options.find(item => item.key === val)
          this.legendList = [
            {label: item.name, color: 'rgb(74,0,131)'},
          ]
        } else {
          options.shift()
          this.legendList = options.map((sub, index) => ({
            label: sub.name,
            color: this.colorList[index]
          }))
        }
      },
      immediate: true
    }
  },
  methods: {
    init(params) {
      this.getData();
      this.getScenicSpotList()
      // this.getProjectList(params);
      // this.getNewsList();
      this.$nextTick(() => {
        this.$refs.map.setBaseVecotrTile(youyangJson)
        this.$refs.map.setBaseTile(this.yyUrl)
        this.getTownData()
      })
    },
    // 获取景区列表
    async getScenicSpotList() {
      const res = await service("get", "/scenic/spot/list", {
        year: this.year,
      });
      if (res.status === 200) {
        this.list = res.data
        this.$refs.map.setScenicSpotText(res.data)
      }
    },
    clickScenicSpotListHandle (item, wait = false) {
      this.scenicSpotSelectedId = item.id
      if(item.location) {
        const [lng, lat] = item.location.split(',')
        this.$refs.map.flyTo([lat, lng], 14)
      }
      this.current = item
      this.getScenicSpotDetail(wait)
      this.getProCondWithUrl()

    },
    // 获取景区详情
    async getScenicSpotDetail(wait) {
      const res = await service("get", `/scenic/spot/details/${this.scenicSpotSelectedId}`, {
        id: this.scenicSpotSelectedId,
        // parent: region ? region : this.region,
        // type: this.statisticType,
      });
      if (res.status === 200) {
        this.currentWh = res.data
        if(wait) {
          setTimeout(() => {
            this.showDetail = true
          }, 1000)
        } else {
          this.showDetail = true
        }
      }
    },
    // 基于乡镇统计
    async getTownData() {
      const res = await service("get", "/gep/stat/town/whfw", {
        year: this.year,
        // parent: region ? region : this.region,
        // type: this.statisticType,
      });
      if (res.status === 200) {
        let dataTownList = []
        Object.keys(res.data).forEach(key => {
          const item = res.data[key]
          dataTownList.push({
            ...item,
            label: key,
            value: item.total
          })
        })
        this.dataTownList = dataTownList
        // this.$nextTick(() => {
        //   // 设置延迟 缓解页面卡顿
        //   setTimeout(() => {
        //     this.$refs.map.renderEcharts(youyangJson)
        //   }, 500)
        // })
      }
    },
    search() {
      this.$nextTick(() => {
        this.$refs.map.renderEcharts(youyangJson, false)
      })
    },
    markClickHandle(point) {
      console.log(point)
      if(this.current.properties && this.current.properties.name === point.properties.name) {
        this.showDetail = false
        this.currentTown = {}
        this.current = {}
        this.$refs.map.setBaseTile(this.yyUrl)
        return
      }
      if(this.showDetail) {
        this.showDetail = false
        setTimeout(() => {
          this.current = point
          this.currentTown = this.dataTownList.find(item => item.label === point.properties.name)
          this.showDetail = true
          // todo 请求接口获取放大后的url
          this.getProCondWithUrl()
        }, 800)
      } else {
        this.current = point
        this.currentTown = this.dataTownList.find(item => item.label === point.properties.name)
        this.showDetail = true
        // todo 请求接口获取放大后的url
        this.getProCondWithUrl()
      }
    },
    async getProCondWithUrl() {
      // 接口url的选择图层里，可以选择是调节服务(VEP_tj)或者物质供给(VEP_gj)
      if(this.year !== '2023') {
        this.$message.info('请选择2023年')
        return
      }
      let name = this.current.name
      if(name === '松鼠丛林乐园') {
        name = '桃花源景区'
      }
      const res = await service("POST", "getProCondWithUrl", {
        year: this.year,
        projectName: name,
        region: this.region,
        page: 1,
        perPage: 1,
        type: 'VEP_wh'
      }, 'MapServer', 2);
      console.log('res', res)
      if (res.status === 0) {
        if(res.data && res.data.items && res.data.items.length > 0) {
          const first = res.data.items[0]
          console.log('first', first)
          this.outputRes = first.outputRes
          this.$refs.map.showResult(first.url)
        }
      }
    },
    goCalc() {
      this.$router.push({
        path: "/home/calculate",
        query: {
          region: this.$route.query.region,
        },
      });
    },
    async mapClick(params) {
      console.log(params);
      // switch (params.seriesType) {
      //   case "map":
      //     this.region = params.name;
      //     // const [lng, lat] =  params.__map_position
      //     this.$router.push({
      //       path: "/home/detail/county",
      //       query: {
      //         region: params.name,
      //       },
      //     });
      //     break;
      //   case "custom":
      //     if (params.data.property) {
      //       // 地块点击
      //       let id = params.data.property.properties.id;
      //       let type = params.data.property.properties.type;
      //       if (type === "EP") {
      //         const res = await service("get", `/project/info/ep/${id}`, {});
      //         if (res.status === 200) {
      //           // 地图实景
      //           const imagesRes = await service(
      //             "get",
      //             `project/images/${id}`,
      //             {}
      //           );
      //           if (imagesRes.status === 200) {
      //             this.property = res.data;
      //             this.property.type = params.data.property.properties.type;
      //             this.property.imagesList = imagesRes.data;
      //             this.showDialog = true;
      //           } else {
      //             this.$message.error(res.message);
      //           }
      //         } else {
      //           this.$message.error(res.message);
      //         }
      //       } else {
      //         const res = await service("get", `/project/info/vep/${id}`, {});
      //         if (res.status === 200) {
      //           // 地图实景
      //           const imagesRes = await service(
      //             "get",
      //             `project/images/${id}`,
      //             {}
      //           );
      //           if (imagesRes.status === 200) {
      //             this.property = res.data;
      //             this.property.type = params.data.property.properties.type;
      //             this.property.imagesList = imagesRes.data;
      //             this.showDialog = true;
      //           } else {
      //             this.$message.error(res.message);
      //           }
      //         } else {
      //           this.$message.error(res.message);
      //         }
      //       }
      //     } else {
      //       // 柱子点击
      //       if (params.name) {
      //         this.region = params.name;
      //       } else {
      //         this.region = `浙江省湖州市${params.data[2].name}`;
      //       }
      //       this.init();
      //     }
      //     break;
      //   case "scatter":
      //     // // 柱子点击
      //     // if (params.name) {
      //     //     this.region = params.name
      //     // } else {
      //     //     this.region = `浙江省湖州市${params.data[2].name}`
      //     // }
      //     // this.init()
      //     break;
      // }
    },
    searchProjectList(data) {
      this.getProjectList(data);
    },
    // 项目列表
    async getProjectList(filterData) {
      this.projectLoading = true;
      //   const res = await service("post", "project/map/list", {
      //     region: this.region,
      //     name: filterData ? filterData.name : "",
      //     type: filterData ? filterData.type : "",
      //   });
      const data = [
        {
          name: "菖蒲盖草原养护采购项目",
          regionname: "花田乡",
          totalValue: "193",
        },
        {
          name: "花田悬崖观景平台改造提升项目",
          regionname: "花田乡",
          totalValue: "370",
        },
        {
          name: "中天锰业有限公司",
          regionname: "龙潭镇",
          totalValue: "5000",
        },
        {
          name: "酉粮·中央花园项目园林景观工程项目",
          regionname: "钟多街道",
          totalValue: "700",
        },
        {
          name: "酉阳县包装饮用水生产项目",
          regionname: "钟多街道",
          totalValue: "500",
        },
        {
          name: "酉阳县菖蒲水库",
          regionname: "花田乡",
          totalValue: "228.24",
        },
        {
          name: "重庆酉州油茶科技有限公司油茶产业园建设项目",
          regionname: "泔溪镇",
          totalValue: "2200",
        },
      ];
      this.projectLoading = false;
      this.projectList = data;
      //   console.log(res.data);
      //   if (res.status === 200) {
      //     this.projectList = res.data;
      //   }
    },
    // 获取应用列表
    async getApp() {
      const res = await service("get", "project/application", {});
      var data = [
        {
          name: "经营开发",
          amount: "32",
          percent: "26.02",
        },
        {
          name: "担保信贷",
          amount: "74",
          percent: "60.16",
        },
        {
          name: "权益交易",
          amount: "17",
          percent: "13.82",
        },
      ];
      if (res.status === 200) {
        this.applicationList = data.map((item) => {
          let data = {
            name: item.name,
            value: item.amount,
            percent: item.percent,
          };
          if (data.name === "土地出让") {
            data.path = "/home/detail/landTransfer";
          }
          return data;
        });
      }
    },
    // 招商列表
    async getNewsList() {
      // const res = await service("get", "news/list", {
      //   region: this.region,
      // });
      // if (res.status === 200) {
      //   this.newsList = res.data;
      // }
      this.newsList = [
        {
          title: "龚滩古镇旅游开发项目招商",
        },
        {
          title: "酉阳县有机茶叶种植与加工项目招商",
        },
        {
          title: "酉阳县生态农庄建设项目招商",
        },
        {
          title: "酉阳县民族文化村落保护与开发项目招商",
        },
        {
          title: "酉阳县高新技术产业园项目招商",
        },
        {
          title: "酉阳县智能装备制造产业园项目招商",
        },
        {
          title: "酉阳县现代物流园区项目招商",
        },
      ];
      console.log(this.newsList);
    },
    // 基于行政区划的项目统计
    async getData(region, cb) {
      const res = await service("get", "/gep/profile/whfw", {
        year: this.year,
        parent: region ? region : this.region,
        type: this.statisticType,
      });
      if (res.status === 200) {
        if (cb) {
          cb(res);
        } else {
          this.totalMaterialSupplyDataTotal = (res.data.total).toFixed(2)
          this.totalMaterialSupplyDataList = this.totalMaterialSupplyDataList.map(item => ({
            ...item,
            value: res.data[item.key]
          }))
          this.$refs.totalAmountServiceRegulation.render()
        }
      }
    },
    // 获取地图geo
    async getMapGeoJson() {
      const parent = "浙江省湖州市";
      await this.getData(parent, (res) => {
        res.data[0].name = '黑水镇'
        this.mapData = res.data[0];
      });

      const res = await service("get", "district/geojson", {
        parent: parent,
      });
      if (res.status === 200) {
        if (res.data) {
          this.huzhouMapJson = youyangJson;
        }
        this.huzhouMapJson = youyangJson;
      }
    },
    // 获取地图geo
    async getMapProjectAreaGeoJson() {
      const res = await service("get", "project/map/geojson", {
        region: this.region,
      });
      if (res.status === 200) {
        if (res.data) {
          this.$nextTick(() => {
            const coordinates = JSON.parse(res.data);
            console.log(coordinates);
            // this.$refs.map.initHZMap(coordinates.features);
            this.$refs.map.setBaseVecotrTile(youyangJson)
          });
          // let jsonData = JSON.parse(res.data)
        }
      }

      // let json = {
      //   type: "FeatureCollection",
      //   features: [
      //     {
      //       type: "Feature",
      //       properties: {
      //         id: 1,
      //         pid: 2,
      //         name: "酉阳县",
      //         type: "EP",
      //       },
      //       geometry: {
      //         type: "MultiPolygon",
      //         coordinates: [
      //           [
      //             [
      //               [28.867, 108.769],
      //               [28.865, 108.771],
      //               [28.865, 108.774],
      //               [28.868, 108.776],
      //               [28.871, 108.775],
      //               [28.873, 108.773],
      //               [28.872, 108.77],
      //               [28.869, 108.768],
      //             ],
      //           ],
      //         ],
      //       },
      //     },
      //   ],
      // };
      let json = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              id: "944322949677330432",
              pid: "59",
              name: "安吉县芝里西地块",
              type: "EP",
              totalValue: "1145.37",
              landWealth: "41500.0",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [
                [
                  [
                    [108.769, 28.867],
                    [108.771, 28.865],
                    [108.774, 28.865],
                    [108.776, 28.868],
                    [108.775, 28.871],
                    [108.773, 28.873],
                    [108.77, 28.872],
                    [108.768, 28.869],
                  ],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: {
              id: "944322949677330432",
              pid: "59",
              name: "安吉县芝里西地块",
              type: "EP",
              totalValue: "1145.37",
              landWealth: "41500.0",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [
                [
                  [
                    [108.74, 28.875],
                    [108.742, 28.878],
                    [108.744, 28.88],
                    [108.746, 28.882],
                    [108.748, 28.883],
                    [108.749, 28.864],
                    [108.752, 28.866],
                    [108.754, 28.869],
                    [108.756, 28.872],
                    [108.756, 28.875],
                    [108.755, 28.878],
                    [108.753, 28.88],
                    [108.751, 28.882],
                    [108.746, 28.883],
                    [108.744, 28.88],
                    [108.742, 28.878],
                    [108.74, 28.869],
                  ],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: {
              id: "944322949677330432",
              pid: "59",
              name: "安吉县芝里西地块",
              type: "EP",
              totalValue: "1145.37",
              landWealth: "41500.0",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [
                [
                  [
                    [108.76, 29.05],
                    [108.77, 29.04],
                    [108.76, 29.03],
                    [108.752, 29.032],
                  ],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: {
              id: "944322949677330432",
              pid: "59",
              name: "安吉县芝里西地块",
              type: "EP",
              totalValue: "1145.37",
              landWealth: "41500.0",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [
                [
                  [
                    [108.78, 29.032],
                    [108.785, 29.028],
                    [108.79, 29.034],
                  ],
                ],
              ],
            },
          },
        ],
      };
      this.$nextTick(() => {
        // this.$refs.map.setBaseVecotrTile(youyangJson);

        // this.$refs.map.showPolygon(json);
      });
    },
    changeYear(params) {
      this.year = params.year;
      this.statisticType = params.type;
      this.getData();
    },
    closeDialog(e) {
    },
    openDialog(item) {
    },
    changeStageHandler() {
    },
    async getList() {
    },
    toggleLeftHandler() {
      this.openLeft = !this.openLeft;
    },
    toggleRightHandler() {
      this.openRight = !this.openRight;
    },
    changeFull(state) {
      this.isFullscreen = state;
    },
    // 判断当前的屏幕是否为全屏状态
    judgeCurrentScreen() {
      this.viewportWidth = document.documentElement.clientWidth;
      this.viewportHeight = document.documentElement.clientHeight;
      console.log(document.body.scrollHeight);
      this.height = document.body.scrollHeight;
      // 非全屏状态
      if (!this.checkFull()) {
        this.changeFull(false);
      }
      // 全屏状态
      if (this.checkFull()) {
        this.changeFull(true);
      }
    },
    fullscreen() {
      screenfull.toggle();
    },
    checkFull() {
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      var isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled;
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    changeScreen() {
      this.fullscreen();
      this.changeFull(!this.screen);
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  background-repeat: repeat;
  background-position: center center;
  background-size: cover;
  min-height: 100vh;
  //overflow: hidden;
  background-color: #08122b;
  overflow: hidden;
  position: relative;

  &.fullscreen {
    .map-wrapper {
      min-height: calc(~"100vh");
    }
  }

  &-container {
    // padding: 20px 30px 20px 40px;
    position: relative;
    background-image: url("../../assets/images/common/body-bg.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    overflow: hidden;
    z-index: 9;
    min-height: 100vh;
    // padding-top: 86px;
    div {
      //   padding: 10px 10px 10px 10px;
    }

    &__section {
      width: 612px;
      height: inherit;
      //background-size: 100% 100%;
      //background-image: url("../../assets/images/common/section.png");
      background-repeat: repeat;
      background-position: 0 0;
      position: relative;
      margin-top: 40px;

      &.mt-5 {
        margin-top: 5px;
      }
    }

    .map {
      margin-left: 605px;
      //position: relative;
      //z-index: 0;
      width: 1059px * 1.2;
      height: 842px * 1.2;
      background: url("../../assets/images/common/dtbj.png") no-repeat center center;
      background-size: 1059px 842px;

      &-logo {
        width: 148px;
        height: 134px;
        position: absolute;
        top: 0;
        right: -168px;

        img {
          width: inherit;
          height: inherit;
        }
      }

      &-wrapper {
        min-height: calc(~"100vh");
        position: relative;
      }

      &-legend {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);

        .item {
          display: flex;
          justify-items: center;
          align-items: center;
          font-family: PingFang SC;
          margin-bottom: 22px;

          &-label {
            font-weight: 400;
            font-size: 18px;
            color: #FFFFFF;
            padding: 0 20px 0 10px;
          }

          &-percent {
            font-family: DIN;
            font-weight: 500;
            font-size: 18px;
            color: #FFFFFF;
          }

          &-rect {
            width: 14px;
            height: 14px;
            background-color: var(--legend-color);
            position: relative;
            border-radius: 2px;
            transform: skewX(-30deg);
          }
        }
      }
    }
  }
}

.fullscreen-btn {
  position: absolute;
  left: -80px;
  top: -10px;
  cursor: pointer;

  img {
    width: 49px;
    height: 48px;
  }
}

.opera {
  position: absolute;
  right: -310px;
  top: 40px;
  display: flex;
}

.calculate-btn {
  width: 99px;
  height: 101px;
  background: url("../../assets/images/common/icon-hs.png") no-repeat 0 0;
  background-size: cover;
  position: absolute;
  left: -130px;
  top: 20px;
  cursor: pointer;
  line-height: 101px;
  color: #fff;
  font-size: 14px;
  font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
  font-weight: normal;
}

.calculate-report-btn {
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
  font-weight: normal;
  line-height: 51px;
  height: 51px;
  width: 147px;
  background-image: url("../../assets/images/common/input-bg.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: contain;
}

.legend {
  padding: 20px;
  border: 1px dashed rgba(151, 151, 151, 1);
  position: absolute;
  left: -160px;
  bottom: 75px;

  &-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    justify-items: center;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    &__icon {
      width: 14px;
      height: 14px;
      margin-right: 15px;
    }

    &__label {
      font-size: 16px;
      font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
      font-weight: normal;
      color: #ffffff;
      line-height: 22px;
    }
  }
}

.statistic-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  margin-bottom: 15px;

  /deep/ .el-form-item {
    margin-bottom: 14px;

    .el-form-item__label {
      font-size: 14px;
      font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
      font-weight: normal;
      color: #fff;
      line-height: 30px;
      text-align: left;
    }

    .el-form-item__content {
      line-height: 30px;
    }
  }

  /deep/ .el-input__inner {
    background-color: transparent;
    border: none;
    border-radius: 0;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    line-height: 42px;
    height: 42px;
    width: 138px;
    background-image: url("../../assets/images/common/input-bg.png");
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: contain;
    padding: 0 10px;
    text-align: center;

    &::placeholder {
      color: #fff;
    }
  }

  /deep/ .el-input__suffix {
    right: 20px;
  }

  /deep/ .el-select__caret {
    transform: rotateZ(0deg);

    &.el-input__icon {
      line-height: 42px;

      &.is-reverse {
        transform: rotateZ(180deg);
      }
    }

    &.el-input__icon::before {
      content: "\e790";
      color: #fff;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      font-size: 12px;
      transform: translate(-50%, -50%);
      //background-image: url("../../../../assets/images/common/input-arrow.png");
      //background-repeat: no-repeat;
      //background-size: 9px 5px;
      //background-position: 0 center;
    }
  }
}
</style>
