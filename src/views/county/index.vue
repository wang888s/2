<template>
  <div class="page" @click="closeDialog" :class="{ fullscreen: isFullscreen }">
    <div ref="pageHeader">
      <page-header></page-header>
    </div>
    <div class="btn-back">
      <back></back>
    </div>
    <div class="page-container" ref="pageContainer">
      <Left :open="openLeft" @toggle="toggleLeftHandler">
        <!-- <div class="page-container__county">{{regionReplace}}</div> -->
        <section
          class="page-container__section"
          v-loading="echartsLoading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <page-title>GEP总值</page-title>
          <div class="page-container__section__content">
            <div class="page-container__total">
              GEP总值（亿元）<number
                :number="`${totalData.total.toString().split(' ')}`"
                class="page-container__total__number"
              ></number>
            </div>
            <div class="select">
              <el-select
                placeholder="请选择"
                v-model="year"
                suffix-icon="CaretBottom"
                @change="changeYear"
              >
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </div>
            <div class="total-list">
              <div class="total-list__wrapper">
                <div
                  class="total-list__item"
                  v-for="(item, index) in totalList"
                  :key="index"
                >
                  <img
                    src="../../assets/images/county/gep-gjcp.png"
                    v-if="index === 0"
                  />
                  <img
                    src="../../assets/images/county/gep-whfw.png"
                    v-if="index === 1"
                  />
                  <img
                    src="../../assets/images/county/gep-tjfw.png"
                    v-if="index === 2"
                  />
                  <div class="total-list__item__label">
                    {{ item.label }}（亿元）
                  </div>
                  <div class="total-list__item__value">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="page-container__section">
          <page-title>项目列表</page-title>
          <project-list
            :itemId="id"
            :list="projectList"
            @listClick="projectListClickHandler"
          ></project-list>
        </section>
      </Left>

      <div class="map">
        <div class="map-wrapper">
          <map-core
            ref="map"
            :center="mapCenter"
            @drawEnd="dragendHandler"
          ></map-core>
        </div>
      </div>

      <Right :open="openRight" @toggle="toggleRightHandler">
        <!--                <div class="opera">-->
        <!--                    <div class="opera-wrapper flex">-->
        <!--                        <el-tooltip class="item" effect="dark" content="多边形画框" placement="top">-->
        <!--                            <div class="opera-icon draw" @click="draw"></div>-->
        <!--                        </el-tooltip>-->
        <!--                        <el-tooltip class="item" effect="dark" content="矩形画框" placement="top">-->
        <!--                            <div class="opera-icon draw-rect" @click="drawRect"></div>-->
        <!--                        </el-tooltip>-->
        <!--                        <div class="opera-icon" :class="{play: !isPlay, stop: isPlay}" @click="togglePlay"></div>-->
        <!--                    </div>-->
        <!--                    <div class="opera-wrapper">-->
        <!--                        <div class="opera-btn primary" v-show="!isCalculate" @click="toggleCalculate">自动核算</div>-->
        <!--                        <div class="opera-btn" v-show="isCalculate" @click="toggleCalculate">取消计算</div>-->
        <!--                        <div class="opera-btn primary" @click="toggleParamsUpdate">调整参数</div>-->
        <!--                        <div class="opera-wrapper__form" v-show="isParamsUpdate">-->
        <!--                            <div class="form">-->
        <!--                                <ds-form ref="dsForm"></ds-form>-->
        <!--                            </div>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->
        <section
          class="page-container__section"
          v-if="
            $route.query.region &&
            ($route.query.region.indexOf('安吉') !== -1 ||
              $route.query.region.indexOf('南浔') !== -1)
          "
        >
          <page-title>核算指标</page-title>
          <accounting-results
            :list="accountingResultsList"
            v-loading="EPLoading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          ></accounting-results>
        </section>
        <section class="page-container__section" v-else>
          <page-title>应用统计</page-title>
          <div class="chart" id="chartYYTJ"></div>
        </section>
        <!--                <section class="page-container__section">-->
        <!--                    <page-title>核算结果</page-title>-->
        <!--                    <accounting-results-list :itemId="id" :list="accountingResultsList" @listClick="listClickHandler"></accounting-results-list>-->
        <!--                </section>-->
        <section
          class="page-container__section"
          v-if="
            $route.query.region && $route.query.region.indexOf('安吉') !== -1
          "
        >
          <page-title>资源统计</page-title>
          <resource-statistics
            :list="resourceStatisticList"
          ></resource-statistics>
        </section>
        <section class="page-container__section" v-else>
          <page-title>招商咨询</page-title>
          <news :list="newsList"></news>
        </section>
      </Right>
    </div>

    <loading ref="loading" v-show="showLoading"></loading>
    <form-dialog
      ref="formDialog"
      v-show="showFormDialog"
      @close="showFormDialog = false"
      @submit="submitCalculate"
    ></form-dialog>
  </div>
</template>

<script>
import pageHeader from "@/components/header";
import pageTitle from "@/components/title";
import Left from "@/components/left";
import Right from "@/components/right";
import projectList from "./subs/projectList";
import accountingResultsList from "./subs/accountingResultsList";
import service from "@/api";
import screenfull from "screenfull";
import { initPie, initBar } from "./util/chart";
import number from "./subs/number";
import dsForm from "@/components/business/ds-form";
import empty from "@/components/empty";
import back from "@/components/back";
import loading from "@/components/loading";
import mapCore from "@/components/map";
import formDialog from "@/components/business/formDialog";
import news from "./subs/news";
import resourceStatistics from "./subs/resourceStatistics";
import accountingResults from "./subs/accountingResults";

export default {
  components: {
    pageHeader,
    pageTitle,
    projectList,
    Left,
    Right,
    accountingResultsList,
    number,
    dsForm,
    empty,
    back,
    loading,
    mapCore,
    formDialog,
    news,
    resourceStatistics,
    accountingResults,
  },
  data() {
    return {
      projectList: [
        // {name: '彰武镇民乐村大河口水库（月亮湖）', value: '724563', time: '2023-11-22'},
      ],
      accountingResultsList: [
        {
          name: "水源涵养(万立方米/年)",
          value: "-",
          kbValue: "-",
          key: "syhy",
        },
        { name: "土壤保持(万吨/年)", value: "-", kbValue: "-", key: "trbc" },
        {
          name: "洪水调蓄 (万立方米/年)",
          value: "-",
          kbValue: "-",
          key: "hstx",
        },
        { name: "固碳(万吨/年)", value: "-", kbValue: "-", key: "gt" },
        { name: "释氧(万吨/年)", value: "-", kbValue: "-", key: "sy" },
        {
          name: "气候调节(万立方米/年)",
          value: "-",
          kbValue: "-",
          key: "qhtj",
        },
        { name: "水质净化(吨/年)", value: "-", kbValue: "-", key: "shjjh" },
        { name: "空气净化(吨/年)", value: "-", kbValue: "-", key: "kqjh" },
        {
          name: "调节服务价值总量(万元)",
          value: "-",
          kbValue: "-",
          key: "tiaojie",
        },
        {
          name: "单位面积调节服务价值EP(元/平方米)",
          value: "-",
          kbValue: "-",
          key: "ep",
        },
        { name: "地块出让价格(万元)", value: "-", kbValue: "-", key: "crjg" },
        { name: "地块增值金(万元)", value: "-", kbValue: "-", key: "crzzj" },
      ],
      EPLoading: false,
      newsList: [],
      openLeft: true,
      openRight: true,
      isFullscreen: false,
      year: 2021,
      options: [],
      statisticData: [],
      huzhouMapJson: {},
      mapData: [],
      id: null,
      echartsData: {
        tiaojie_jz: 0,
        gongji_jz: 0,
      },
      isPlay: false,
      isCalculate: false,
      isParamsUpdate: false,
      showLoading: false,
      geometry: null,
      projectID: null,
      EPResult: {},
      echartsLoading: false,
      showFormDialog: false,
      totalList: [
        {
          label: "供给产品",
          value: 0,
          key: "wzGj",
        },
        {
          label: "文化服务",
          value: 0,
          key: "whFw",
        },
        {
          label: "调节服务",
          value: 0,
          key: "tjFw",
        },
      ],
      mapCenter: [],
      totalData: {
        total: "",
      },
      selection: {},
      resourceStatisticList: [
        { name: "森林生态系统", area: "-", percent: "-" },
        { name: "灌从生态系统", area: "-", percent: "-" },
        { name: "草地生态系统", area: "-", percent: "-" },
        { name: "湿地生态系统", area: "-", percent: "-" },
        { name: "农田生态系统", area: "-", percent: "-" },
        { name: "城镇生态系统", area: "-", percent: "-" },
      ],
    };
  },
  computed: {
    totalValue() {
      return this.a.reduce((pre, cur, index) => {
        return pre + cur.value;
      }, 0);
    },
    region() {
      return this.$route.query.region;
    },
    regionReplace() {
      return this.$route.query.region.replace("浙江省湖州市", " ");
    },
  },
  created() {
    if (this.$route.query.region) {
      const geoCoordMap = {
        浙江省湖州市吴兴区: [120.040351, 30.714089],
        浙江省湖州市安吉县: [119.687136, 30.64169],
        浙江省湖州市德清县: [119.980019, 30.544398],
        浙江省湖州市南浔区: [120.3246, 30.778963],
        浙江省湖州市长兴县: [119.800372, 31.020944],
        浙江省湖州市南太湖新区: [120.123766, 30.94005],
      };
      const position = geoCoordMap[this.$route.query.region];
      this.mapCenter = [position[1], position[0]];
    }
  },
  mounted() {
    window.addEventListener("resize", this.judgeCurrentScreen);
    document.title = `${this.regionReplace}生态产品数字化平台`;
    for (let i = 0; i <= 10; i++) {
      this.options.push(this.year - i);
    }
    if (this.$route.query.region.indexOf("南浔") !== -1) {
      this.year = 2020;
    }
    this.init();
    this.getTotalData();
  },
  methods: {
    // EP核算结果
    async getEP() {
      this.EPLoading = true;
      const res = await service(
        "get",
        `project/details/${this.selection.id}`,
        {}
      );
      this.EPLoading = false;
      if (res.status === 200) {
        this.accountingResultsList.forEach((item) => {
          item.value = res.data[item.key];
          item.kbValue = res.data[`${item.key}_jz`];
        });
      }
    },
    // 资源统计
    async ecosystem(id) {
      const res = await service("get", `project/ecosystem/${id}`, {});
      if (res.status === 200) {
        this.resourceStatisticList.forEach((item) => {
          res.data.forEach((sub) => {
            if (item.name === sub.name) {
              item.area = sub.area;
              item.percent = sub.percent;
            }
          });
        });
      }
    },
    async getTotalData() {
      const res = await service("get", "district/profile", {
        region: this.region,
        year: this.year,
      });
      this.totalData = res.data;
      this.totalList.forEach((item) => {
        item.value = res.data[item.key];
      });
    },
    // 新闻列表
    async getNewsList() {
      const res = await service("get", "news/list", {
        region: this.region,
      });
      if (res.status === 200) {
        this.newsList = res.data;
      }
    },
    // 获取指定区域影像地图
    async getDistrictRasterTile() {
      const res = await service("get", "district/raster/tile", {
        region: this.region,
      });
      if (res.status === 200) {
        this.$nextTick(() => {
          console.log(res.data.url);
          this.$refs.map.setBaseTile(res.data.url);
        });
      }
      this.getVectorTile();
    },
    draw(e) {
      this.$refs.map.startDrawPolygon(e);
    },
    drawRect(e) {
      this.$refs.map.startDrawRect(e);
    },
    async toggleCalculate() {
      if (!this.geometry) {
        this.$message.error("请绘制地块");
        return;
      }
      this.showFormDialog = true;
    },
    async submitCalculate(modelValue) {
      if (this.isCalculate) return;
      this.isCalculate = true;
      // const modelValue = this.$refs.dsForm.getModelValue();
      const res = await service(
        "post",
        "/projectEP",
        {
          ...this.geometry,
          region: this.region,
          projectName: modelValue.projectName,
        },
        "geo_calc"
      );
      this.isCalculate = false;
      if (res.status === 0) {
        this.projectID = res.data.projectID;
        // this.projectID = 'a8fca39b-dc63-481f-b837-de98bf718195'

        // 计算结果演示效果
        this.showLoading = true;
        this.$nextTick(async () => {
          this.$refs.loading.start();
          await this.getCalcResultProgress();
        });
      } else {
        // this.projectID = 'a8fca39b-dc63-481f-b837-de98bf718195'
        // 计算结果演示效果
        // this.showLoading = true;
        // this.$nextTick(async() => {
        //     this.$refs.loading.start()
        //     await this.getCalcResultProgress()
        // })
        this.$refs.map.clearDraw();
        this.$message.error(res.msg);
      }
    },
    // 实时进度查询
    async getCalcResultProgress() {
      const res = await service(
        "get",
        "/status",
        {
          task_id: this.projectID,
        },
        "geo_calc"
      );
      if (res.state == "SUCCESS") {
        this.$refs.loading.done();
        setTimeout(() => {
          this.showLoading = false;
        }, 1500);
        this.getCalcResult();
      } else {
        setTimeout(() => {
          this.getCalcResultProgress();
        }, 3000);
      }
      // this.$refs.map.clearDraw()
      // this.$refs.loading.done()
      // this.showLoading = false
      // this.$message.error(res.msg)
    },
    // EP计算结果
    async getCalcResult() {
      this.echartsLoading = true;
      const res = await service(
        "get",
        "/calResult",
        {
          task_id: this.projectID,
        },
        "geo_calc"
      );
      this.echartsLoading = false;
      if (res.status === 0) {
        this.$message.success("EP核算成功！");
        if (res.data && res.data.items && res.data.items.length > 0) {
          this.EPResult = res.data.items[0].tjfw;
          this.echartsData.tiaojie_jz = res.data.items[0].benefit.toFixed(2);
          this.$nextTick(() => {
            this.$refs.map.showResult(res.data.items[0].url);
          });
          this.initEchartsEPResult();
          this.getProjectBusinessList();
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    toggleParamsUpdate() {
      this.isParamsUpdate = !this.isParamsUpdate;
    },
    togglePlay() {
      this.isPlay = !this.isPlay;
    },
    listClickHandler(item) {
      this.id = item.id;
      this.projectDetail();
    },
    initEcharts() {
      let chartTJFWData = [
        { name: "固碳", value: 0, key: "gt_jz" },
        { name: "释氧", value: 0, key: "sy_jz" },
        { name: "土壤保持", value: 0, key: "trbc_jz" },
        { name: "水源涵养", value: 0, key: "syhy_jz" },
        { name: "洪水调蓄", value: 0, key: "hstx_jz" },
        { name: "气候调节", value: 0, key: "qhtj_jz" },
        { name: "空气净化", value: 0, key: "kqjh_jz" },
        { name: "水质净化", value: 0, key: "shjjh_jz" },
      ];
      let chartWZCPData = [
        // {name: '再生产品', value: 0},
        { name: "渔产品", value: 0, key: "yu_jz" },
        { name: "牧产品", value: 0, key: "mu_jz" },
        { name: "林产品", value: 0, key: "ling_jz" },
        { name: "农产品", value: 0, key: "nong_jz" },
      ];
      chartTJFWData.forEach((item) => {
        item.value = this.echartsData[item.key];
      });
      chartWZCPData.forEach((item) => {
        item.value = this.echartsData[item.key];
      });
      initPie("chartTJFW", chartTJFWData);
      initPie("chartWZCP", chartWZCPData);
    },
    initEchartsEPResult() {
      let chartTJFWData = [
        { name: "固碳", value: 0, key: "gt_jz" },
        { name: "释氧", value: 0, key: "sy_jz" },
        { name: "土壤保持", value: 0, key: "trbc_jz" },
        { name: "水源涵养", value: 0, key: "syhy_jz" },
        { name: "洪水调蓄", value: 0, key: "hstx_jz" },
        { name: "气候调节", value: 0, key: "qhtj_jz" },
        { name: "空气净化", value: 0, key: "kqjh_jz" },
        { name: "水质净化", value: 0, key: "shjjh_jz" },
      ];
      // let chartWZCPData = [
      //     // {name: '再生产品', value: 0},
      //     {name: '渔产品', value: 0, key: 'yu_jz'},
      //     {name: '牧产品', value: 0, key: 'mu_jz'},
      //     {name: '林产品', value: 0, key: 'ling_jz'},
      //     {name: '农产品', value: 0, key: 'nong_jz'},
      // ]
      chartTJFWData = chartTJFWData.filter((item) => !!this.EPResult[item.key]);
      chartTJFWData.forEach((item) => {
        item.value = this.EPResult[item.key];
      });
      // chartWZCPData.forEach(item => {
      //     item.value = this.echartsData[item.key]
      // })
      initPie("chartTJFW", chartTJFWData);
      // initPie('chartWZCP', chartWZCPData)
    },
    init() {
      // this.getMapGeoJson();
      // this.projectDetailTotal();
      this.getProjectMapList();
      // this.getProjectBusinessList();
      this.getDistrictRasterTile();
      this.getNewsList();
      this.getAppTrend();
      this.getMapDataGeojson();
    },
    projectListClickHandler(item) {
      this.selection = item;
      this.id = item.id;
      if (this.region.indexOf("安吉") !== -1) {
        this.ecosystem(item.id);
      }
      if (
        this.region.indexOf("安吉") !== -1 ||
        this.region.indexOf("南浔") !== -1
      ) {
        this.getEP();
      }
      this.getMapDataGeojson();
      this.getMapReady();
    },
    async getMapReady() {
      const res = await service(
        "get",
        "/getmapReady",
        {
          name: this.selection.name,
        },
        "webserver"
      );
      if (res.status === 200) {
        this.$refs.map.showResult(res.data.items.url);
      }
    },
    // 获取地图geo
    async getMapDataGeojson() {
      console.log(this.selection);
      const res = await service("get", "project/map/geojson", {
        region: this.region,
        id: this.selection.id,
      });
      console.log(res);
      if (res.status === 200) {
        if (res.data) {
          let jsonData = JSON.parse(res.data);
          console.log(jsonData);
          // jsonData.features = jsonData.features.filter(item => item.properties.name === '浙江省湖州市安吉县')
          this.$refs.map.showPolygon(jsonData);
        }
      }
    },
    async getVectorTile() {
      const res = await service("get", "district/vector/tile", {
        region: this.region,
      });
      if (res.status === 200) {
        this.$refs.map.setBaseVecotrTile(res.data.url);
      }
    },
    async getAppTrend() {
      const res = await service("get", "project/stat/trend", {
        region: this.region,
      });
      if (res.status === 200) {
        this.$nextTick(() => {
          // 处理数据
          let arr = [];
          Object.keys(res.data).forEach((key) => {
            let obj = {
              year: key + "年",
              ...res.data[key],
            };
            arr.push(obj);
          });
          initBar("chartYYTJ", arr);
        });
      }
    },
    // 获取地图geo
    async getMapGeoJson() {
      const parent = "浙江省湖州市";
      const res = await service("get", "district/geojson", {
        parent: parent,
      });
      if (res.status === 200) {
        if (res.data) {
          let jsonData = JSON.parse(res.data);
          jsonData.features = jsonData.features.filter(
            (item) => item.properties.name === this.region
          );
          this.$refs.map.setRegion(jsonData);
        }
      }
    },
    dragendHandler(json) {
      this.geometry = json;
      console.log("json", json);
    },
    // 项目列表
    async getProjectMapList() {
      const res = await service("post", "project/map/list", {
        region: this.region,
      });
      if (res.status === 200) {
        this.projectList = res.data;
      }
    },
    // 核算结果列表
    async getProjectBusinessList() {
      const res = await service("post", "project/business/list", {
        region: this.region,
      });
      if (res.status === 200) {
        this.accountingResultsList = res.data;
      }
    },
    async projectDetail() {
      this.echartsLoading = true;
      const res = await service("get", `project/details/${this.id}`, {});
      this.echartsLoading = false;
      if (res.status === 200) {
        this.echartsData = res.data;
        this.$nextTick(() => {
          this.initEcharts();
        });
      }
    },
    async projectDetailTotal() {
      this.echartsLoading = true;
      const res = await service("get", `project/details/total`, {
        region: this.region,
      });
      this.echartsLoading = false;
      if (res.status === 200) {
        this.echartsData = res.data;
        this.$nextTick(() => {
          this.initEcharts();
        });
      }
    },
    changeYear(year) {
      this.year = year;
      this.getTotalData();
    },
    closeDialog(e) {},
    openDialog(item) {},
    changeStageHandler() {},
    async getList() {},
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
  background-image: url("../../assets/images/common/bg.png");
  background-repeat: repeat;
  background-position: 0 0;
  min-height: 100vh;

  .chart {
    height: 485px;
  }

  &.fullscreen {
    .map-wrapper {
      min-height: calc(~"100vh - 120px");
    }
  }

  &-container {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    &__county {
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
      font-weight: normal;
      color: #ffffff;
      padding-left: 68px;
      background-image: url("../../assets/images/county/icon-house.png");
      background-repeat: no-repeat;
      background-position: 0 center;
      background-size: 62px 60px;
      position: absolute;
      right: -170px;
      top: 0;
    }

    &__total {
      font-size: 18px;
      font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
      font-weight: normal;
      color: #ffffff;
      line-height: 25px;
      margin-top: 25px;
      margin-bottom: 5px;
      text-align: left;
      padding-left: 52px;
      position: relative;
      padding-bottom: 27px;

      &:before {
        content: "";
        width: 33px;
        height: 32px;
        background: url("../../assets/images/county/gep-total.png") no-repeat 0
          0;
        background-size: cover;
        position: absolute;
        top: 5px;
        left: 0;
      }

      &__number {
        margin-top: 15px;
      }
    }

    &__section {
      width: 509px;
      height: inherit;
      background-size: 100% 100%;
      background-image: url("../../assets/images/common/section.png");
      background-repeat: repeat;
      background-position: 0 0;
      position: relative;
      margin-top: 25px;

      &:after {
        content: "";
        width: 509px;
        height: 3px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: url("../../assets/images/common/section-line.png");
        background-repeat: repeat;
        background-position: center 0;
        background-size: 100% 100%;
      }

      &__content {
        padding: 0 20px;
        position: relative;
      }
    }

    .map {
      margin: 0 auto;
      position: relative;
      z-index: 0;

      &-wrapper {
        width: 100vw;
        min-height: calc(~"100vh - 120px");
        position: relative;
        margin: 0 auto;
      }
    }
  }
}

.opera {
  position: absolute;
  top: -10px;
  left: -330px;
  display: flex;

  &-wrapper {
    position: relative;

    &.flex {
      display: flex;
      margin-right: 20px;
      margin-top: -10px;
    }

    &__form {
      position: absolute;
      right: 0;
      top: 100%;
      width: 312px;
      .form {
      }
    }
  }

  &-icon {
    width: 64px;
    height: 64px;
    border-radius: 100%;
    background: url("../../assets/images/county/icon-cicrle.png") no-repeat 0 0;
    background-size: contain;
    position: relative;
    cursor: pointer;

    &.draw {
      &:before {
        content: "";
        background: url("../../assets/images/county/icon-draw.png") no-repeat 0
          0;
        background-size: cover;
        width: 30px;
        height: 30px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &.draw-rect {
      &:before {
        content: "";
        background: url("../../assets/images/county/icon-draw-rect.png")
          no-repeat 0 0;
        background-size: cover;
        width: 30px;
        height: 30px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &.stop {
      &:before {
        content: "";
        background: url("../../assets/images/county/icon-stop.png") no-repeat 0
          0;
        background-size: cover;
        width: 30px;
        height: 30px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &.play {
      &:before {
        content: "";
        background: url("../../assets/images/county/icon-play.png") no-repeat 0
          0;
        background-size: cover;
        width: 30px;
        height: 30px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  &-btn {
    width: 96px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    box-shadow: 0px 0px 8px 0px rgba(72, 129, 255, 0.58);
    background: linear-gradient(
        171deg,
        rgba(72, 129, 255, 0.65),
        rgba(72, 129, 255, 0.36),
        rgba(72, 129, 255, 0.54),
        rgba(72, 129, 255, 0.65),
        rgba(72, 129, 255, 1)
      )
      1 1;
    font-size: 14px;
    font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #ffffff;
    border-radius: 25px;
    margin-bottom: 24px;
    cursor: pointer;

    &.primary {
      background: rgba(72, 129, 255, 0.52);
    }
  }
}

//.fullscreen {
//    position: absolute;
//    right: 40px;
//    top: 15px;
//    cursor: pointer;
//
//    img {
//        width: 49px;
//        height: 48px;
//    }
//}

.btn-back {
  position: relative;
  height: 35px;
  margin-top: -10px;
}

.total-list {
  padding: 27px 37px 37px 37px;
  border-top: 1px solid rgba(211, 242, 255, 0.3);

  &__wrapper {
    display: flex;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
  }
  &__item {
    img {
      width: 78px;
      margin-bottom: 5px;
    }
    &__label {
      font-size: 14px;
      font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
      font-weight: normal;
      color: #ffffff;
      line-height: 20px;
      margin-bottom: 5px;
    }
    &__value {
      font-size: 28px;
      font-family: DINAlternate, DINAlternate;
      font-weight: bold;
      color: #ffffff;
      line-height: 32px;
    }
  }
}

.select {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: -7px;
  right: 20px;
  z-index: 1;
  width: 113px;

  /deep/ .el-input__inner {
    background-color: transparent;
    border: none;
    border-radius: 0;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    line-height: 30px;
    height: 36px;
    width: 113px;
    background-image: url("../../assets/images/common/input-bg.png");
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: contain;

    &::placeholder {
      color: #fff;
    }
  }

  /deep/ .el-select__caret {
    transform: rotateZ(0deg);
    &.el-input__icon {
      line-height: 36px;

      &.is-reverse {
        transform: rotateZ(180deg);
      }
    }

    &.el-input__icon::before {
      content: "\e790";
      color: rgba(79, 186, 248, 1);
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
