<template>
  <div class="page" @click="closeDialog" :class="{ fullscreen: isFullscreen }">
    <!--    <div ref="pageHeader">-->
    <!--      <page-header></page-header>-->
    <!--    </div>-->
    <div class="page-container" ref="pageContainer">
      <div>
        <Left :open="openLeft" @toggle="toggleLeftHandler">
          <div class="opera">
            <el-form class="statistic-form" inline>
              <el-form-item>
                <el-select
                  placeholder="请选择"
                  v-model="year"
                  suffix-icon="CaretBottom"
                  @change="search"
                >
                  <el-option
                    v-for="(item, index) in options"
                    :key="index"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="calculate-report-btn" @click="showHSReport">
              <div>核算报告</div>
            </div>
          </div>
          <!-- <div class="map-logo">
                    <img src="../../assets/images/common/map-logo.png" alt="">
                </div> -->
          <section class="page-container__section">
            <page-title>GEP总量及结构分布</page-title>
            <statistic
              ref="statistic"
              :statisticData="statisticData"
              @search="changeYear"
              :typeOptions="typeOptions"
            ></statistic>
          </section>

          <section class="page-container__section">
            <page-title>乡镇排名</page-title>
            <area-statistic-progress :dataList="dataTownList" :type="searchParams.type"></area-statistic-progress>
          </section>
        </Left>

        <div class="map">
          <div class="map-wrapper">
            <map-core ref="map" :region="region" :legendList="legendList" :mapData="mapData"
                      :mapJson="mapJson"
                      @mapClick="mapClick"></map-core>
          </div>
        </div>

        <Right :open="openRight" @toggle="toggleRightHandler">
                    <div class="calculate-btn" @click="goCalc">
                      <div>核算</div>
                    </div>

          <section class="page-container__section">
            <page-title link @click.native="goPage('/home/detail/material-supply')">物质供给总量</page-title>
            <total-material-supply ref="totalMaterialSupply" :dataList="totalMaterialSupplyDataList"
                                   :total="totalMaterialSupplyDataTotal"></total-material-supply>
          </section>

          <section class="page-container__section">
            <page-title link @click.native="goPage('/home/detail/adjust-service')">调节服务总量</page-title>
            <adjust-total-amount-services ref="adjustTotalAmountServices" :total="adjustTotalAmountServicesTotal"
                                          :dataList="adjustTotalAmountServicesDataList"></adjust-total-amount-services>
          </section>

          <section class="page-container__section">
            <page-title link @click.native="goPage('/home/detail/culture-service')">文化服务总量</page-title>
            <total-amount-cultural-services ref="totalAmountCulturalServices" :total="totalAmountCulturalServicesTotal"
                                            :dataList="totalAmountCulturalServicesDataList"></total-amount-cultural-services>
          </section>
        </Right>
      </div>
    </div>

    <ds-dialog
      :show="showDialog"
      @close="showDialog = false"
      :property="property"
    ></ds-dialog>
  </div>
</template>

<script>
import pageHeader from "@/components/header";
import pageTitle from "@/components/title";
import Left from "@/components/left";
import Right from "@/components/right";
import projectList from "./subs/projectList";
import statistic from "./subs/statistic";
import application from "./subs/application";
import mapCore from "./subs/map/1.vue";
import service from "@/api";
import screenfull from "screenfull";
import dsDialog from "./subs/dialog";
// import youyangJson from "../../assets/json/youyang.json";
import youyangJson from "../../assets/json/xzq(1).json";
// 文化服务总量
import TotalAmountCulturalServices from './subs/total-amount-cultural-services'
// 调节服务总量
import AdjustTotalAmountServices from './subs/adjust-total-amount-services'
// 物质供给总量
import TotalMaterialSupply from './subs/total-material-supply'
import AreaStatisticProgress from './subs/area-statistic-progress'

export default {
  components: {
    pageHeader,
    pageTitle,
    projectList,
    statistic,
    application,
    mapCore,
    Left,
    Right,
    dsDialog,
    AdjustTotalAmountServices,
    TotalMaterialSupply,
    TotalAmountCulturalServices,
    AreaStatisticProgress,
  },
  data() {
    return {
      projectList: [],
      applicationList: [
        // {name: '土地出让', value: '724563', percent: 17.2, path: '/home/detail/landTransfer'},
      ],
      newsList: [],
      openLeft: false,
      openRight: false,
      isFullscreen: false,
      yearLimit: new Date().getFullYear(),
      year: 2020,
      statisticData: {},
      // 项目区域
      region: "浙江省湖州市",
      mapJson: youyangJson,
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
        {label: "EP", color: "rgba(255, 94, 107, 1)"},
        {label: "GEP", color: "rgba(255, 94, 107, 1)"},
        {label: "VEP", color: "rgba(255, 94, 107, 1)"},
      ],
      projectLoading: false,
      typeOptions: [
        {label: "全部", value: ""},
        {label: "土地出让", value: "EP"},
        {label: "综合整治", value: "GEP"},
        {label: "经营开发", value: "VEP"},
      ],
      statisticType: "",
      options: [],
      // 物质供给
      totalMaterialSupplyDataTotal: 0,
      totalMaterialSupplyDataList: [
        {
          name: '农产品',
          key: 'nyCp',
          value: ''
        },
        {
          name: '林产品',
          key: 'lyCp',
          value: ''
        },
        {
          name: '牧产品',
          key: 'myCp',
          value: ''
        },
        {
          name: '渔产品',
          key: 'yyCp',
          value: ''
        },
        {
          name: '能源产品',
          key: 'neyCp',
          value: ''
        },
      ],
      // 调节服务
      adjustTotalAmountServicesTotal: 0,
      adjustTotalAmountServicesDataList: [
        {
          name: '水源涵养',
          key: 'syHy',
          value: ''
        },
        {
          name: '土壤保持',
          key: 'trBc',
          value: ''
        },
        {
          name: '洪水调蓄',
          key: 'hsTx',
          value: ''
        },
        {
          name: '固碳',
          key: 'gt',
          value: ''
        },
        {
          name: '释氧',
          key: 'sy',
          value: ''
        },
        {
          name: '气候调节',
          key: 'qhTj',
          value: ''
        },
        {
          name: '空气净化',
          key: 'kqJh',
          value: ''
        },
        {
          name: '水质净化',
          key: 'shjJh',
          value: ''
        },
      ],
      // 文化服务
      totalAmountCulturalServicesTotal: 0,
      totalAmountCulturalServicesDataList: [
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
      dataTownList: [],
      searchParams: {
        type: ''
      }
    };
  },
  computed: {
    totalValue() {
      return this.a.reduce((pre, cur, index) => {
        return pre + cur.value;
      }, 0);
    },
    isShowReport() {
      return this.year === 2023
    }
  },
  async mounted() {
    this.judgeCurrentScreen();
    window.addEventListener("resize", this.judgeCurrentScreen);
    // await this.getMapGeoJson();
    // this.getApp();
    // this.getMapProjectAreaGeoJson();
    this.$nextTick(() => {
      setTimeout(() => {
        this.openLeft = true
        this.openRight = true
      }, 300)
    })
    await this.getYear()
    this.init({type: "VEP", name: ""});
  },
  watch: {
    viewportHeight(new1, val) {
      if (new1 > val && val != 0 && new1 == this.height) {
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
  },
  methods: {
    openNewPage() {
      window.open('http://120.26.15.133:8098/pdf/5f3b462c-569d-45b2-8d78-985ecb5a4b7f.pdf', '_blank');
    },
    showHSReport() {
      if (this.isShowReport) {
        this.openNewPage()
      } else {
        this.$message.warning('当前无可查看的核算报告！')
      }
    },
    goPage(path) {
      this.$router.push({
        path,
        query: {year: this.year}
      })
    },
    // 获取可选值的年份
    async getYear() {
      // for (let i = 0; i <= 10; i++) {
      //   this.options.push(this.yearLimit - i);
      // }
      const res = await service("get", "/gep/list/year", {});
      if (res.status === 200) {
        this.options = res.data.reverse()
        this.year = this.options[0] || 2020
      }
    },
    // 获取乡镇总值
    async getTownTotal() {
      const res = await service("get", "/gep/stat/town/total", {
        year: this.year,
        // parent: region ? region : this.region,
        // type: this.statisticType,
      });
      if (res.status === 200) {
        this.$nextTick(() => {
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
          this.$refs.map.initMap(res.data);
        })
      }
    },
    init(params) {
      this.getData();
      this.getTownTotal();
      // this.getProjectList(params);
      // this.getNewsList();
    },
    goCalc() {
      this.$router.push({
        path: "/home/calculate/detail",
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
    search() {
      this.init()
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
    // 总值概况
    async getData(region, cb) {
        // 重置
      this.statisticData.total = 0
      this.adjustTotalAmountServicesTotal = 0
      const res = await service("get", "/gep/profile/total", {
        year: this.year,
        // parent: region ? region : this.region,
        // type: this.statisticType,
      });
      if (res.status === 200) {
        if (cb) {
          cb(res);
        } else {
          // 数据处理
          try {
            const {wzGj, whFw, tjFw} = res.data
            this.statisticData = {
              total: res.data.total || 0,
              tjFw: tjFw.total || 0,
              whFw: whFw.total || 0,
              wzGj: wzGj.total || 0
            };


            // this.statisticData.wzGj = 50.1553
            // this.statisticData.whFw = 97.9493
            if(this.year == 2023) {
                this.statisticData.tjFw = 419.8743
            }
              this.statisticData.total = parseFloat(this.statisticData.wzGj + this.statisticData.whFw + this.statisticData.tjFw)

            // 物质供给
            this.totalMaterialSupplyDataTotal = parseFloat((this.statisticData.wzGj || 0).toFixed(2))
            this.totalMaterialSupplyDataList = this.totalMaterialSupplyDataList.map(item => ({
              ...item,
              value: wzGj[item.key] || 0
            }))

            // 调节服务
            this.adjustTotalAmountServicesTotal = parseFloat((this.statisticData.tjFw || 0).toFixed(2))
            if(this.year == 2023) {
              this.adjustTotalAmountServicesDataList = [
                {
                  name: '水源涵养',
                  key: 'syHy',
                  value: 24.8272027729911
                },
                {
                  name: '土壤保持',
                  key: 'trBc',
                  value: 93.6529861692176
                },
                {
                  name: '洪水调蓄',
                  key: 'hsTx',
                  value: 37.8959761600904
                },
                {
                  name: '固碳',
                  key: 'gt',
                  value: 0.618098337260068
                },
                {
                  name: '释氧',
                  key: 'sy',
                  value: 15.2020988658058
                },
                {
                  name: '气候调节',
                  key: 'qhTj',
                  value: 247.650018111831
                },
                {
                  name: '空气净化',
                  key: 'kqJh',
                  value: 0.0273402105164981
                },
                {
                  name: '水质净化',
                  key: 'shjJh',
                  value: 0.000585595850000001
                },
              ]
            } else {
              this.adjustTotalAmountServicesDataList = this.adjustTotalAmountServicesDataList.map(item => ({
                ...item,
                value: tjFw[item.key] || 0
              }))
            }

            // 文化服务
            this.totalAmountCulturalServicesTotal = parseFloat((this.statisticData.whFw || 0).toFixed(2))
            this.totalAmountCulturalServicesDataList = this.totalAmountCulturalServicesDataList.map(item => ({
              ...item,
              value: whFw[item.key] || 0
            }))

            this.$refs.totalMaterialSupply.render()
            this.$refs.adjustTotalAmountServices.render()
            this.$refs.totalAmountCulturalServices.render()
          } catch (e) {
            console.log(e)
          }
        }
      }
    },
    // 获取地图geo
    async getMapGeoJson() {
      const parent = "浙江省湖州市";
      await this.getData(parent, (res) => {
        // res.data[0].name = '黑水镇'
        // this.mapData = res.data[0];
      });

      const res = await service("get", "district/geojson", {
        parent: parent,
      });
      if (res.status === 200) {
        if (res.data) {
          this.mapJson = youyangJson;
        }
        this.mapJson = youyangJson;
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
            this.$refs.map.initHZMap(coordinates.features);
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
      margin-top: 12px;
    }

    .map {
      margin: 0 auto;
      //position: relative;
      //z-index: 0;
      //background: url("../../assets/images/common/dtbj.png") no-repeat center center;
      //background-size: 1059px 842px;

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
        width: 100vw;
        min-height: calc(~"100vh");
        position: relative;
        margin: 0 auto;
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
  line-height: 42px;
  height: 42px;
  width: 138px;
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
