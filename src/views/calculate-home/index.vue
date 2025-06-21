<template>
  <div class="page" @click="closeDialog" :class="{fullscreen: isFullscreen}">
<!--    <div ref="pageHeader">-->
<!--      <page-header></page-header>-->
<!--    </div>-->
    <div class="page-container" ref="pageContainer">
      <Left :open="openLeft" @toggle="toggleLeftHandler">
<!--        <div class="map-logo">-->
<!--          <img src="../../assets/images/common/map-logo.png" alt="">-->
<!--        </div>-->
        <section class="page-container__section">
          <page-title>项目列表</page-title>
          <project-list :list="projectList" @search="searchProjectList" :loading="projectLoading" :typeOptions="typeOptions"></project-list>
        </section>
        <section class="page-container__section">
          <page-title>信息统计</page-title>
          <statistic ref="statistic" :statisticData="statisticData" @search="changeYear" :typeOptions="typeOptions"></statistic>
        </section>
      </Left>

      <div class="map">
        <div class="map-wrapper">
          <map-core ref="map" :region="region" :legendList="legendList" :mapData="mapData" :mapJson="mapJson"
                    @mapClick="mapClick"></map-core>
        </div>
      </div>

      <Right :open="openRight" @toggle="toggleRightHandler">
        <div class="fullscreen-btn" @click="changeScreen">
          <img src="../../assets/images/common/icon-fullscreen.png" alt="">
        </div>
        <div class="calculate-btn" @click="goCalc">
          <div>计算</div>
        </div>
        <!--                <div class="legend">-->
        <!--                    <div class="legend-item" v-for="(item, index) in legendList" :key="index">-->
        <!--                        <div class="legend-item__icon" :style="{background: item.color}"></div>-->
        <!--                        <div class="legend-item__label">{{item.label}}</div>-->
        <!--                    </div>-->
        <!--                </div>-->
        <section class="page-container__section">
          <page-title>应用</page-title>
          <application :list="applicationList"></application>
        </section>
        <section class="page-container__section">
          <page-title>新闻咨询</page-title>
          <news :list="newsList"></news>
        </section>
      </Right>
    </div>

    <ds-dialog :show="showDialog" @close="showDialog = false" :property="property"></ds-dialog>
  </div>
</template>

<script>
import pageHeader from '@/components/header'
import pageTitle from '@/components/title'
import Left from '@/components/left'
import Right from '@/components/right'
import projectList from './subs/projectList'
import statistic from './subs/statistic'
import application from './subs/application'
import news from './subs/news'
import mapCore from './subs/map'
import service from '@/api'
import screenfull from "screenfull";
import dsDialog from './subs/dialog'
import youyangJson from "../../assets/json/xzq(1).json";

export default {
  components: {
    pageHeader,
    pageTitle,
    projectList,
    statistic,
    application,
    news,
    mapCore,
    Left,
    Right,
    dsDialog
  },
  data() {
    return {
      projectList: [],
      applicationList: [
        // {name: '土地出让', value: '724563', percent: 17.2, path: '/home/detail/landTransfer'},
      ],
      newsList: [],
      openLeft: true,
      openRight: true,
      isFullscreen: false,
      year: 2023,
      statisticData: [],
      // 项目区域
      region: '浙江省湖州市',
      mapJson: youyangJson,
      mapData: [],
      showDialog: false,
      property: {},
      legendList: [
        // {label: 'EP', color: 'rgba(255, 94, 107, 1)'},
        // {label: 'GEP', color: 'rgba(255, 204, 2, 1)'},
        // {label: 'VEP', color: 'rgba(168, 64, 196, 1)'},
        {label: 'EP', color: 'rgba(255, 94, 107, 1)'},
        {label: 'GEP', color: 'rgba(255, 94, 107, 1)'},
        {label: 'VEP', color: 'rgba(255, 94, 107, 1)'},
      ],
      projectLoading: false,
      typeOptions: [
        {label: '全部', value: ''},
        {label: '土地出让', value: 'EP'},
        {label: '综合整治', value: 'GEP'},
        {label: '经营开发', value: 'VEP'},
      ],
      statisticType: ''
    }
  },
  computed: {
    totalValue() {
      return this.a.reduce((pre, cur, index) => {
        return pre + cur.value
      }, 0)
    }
  },
  mounted() {
    window.addEventListener('resize', this.judgeCurrentScreen)
    this.getApp();
    this.init({type: 'VEP', name: ''})
  },
  methods: {
    init(params) {
      this.getData();
      this.getProjectList(params);
      this.getNewsList();
      this.$nextTick(() => {
        this.$refs.map.initMap([])
      })
    },
    goCalc () {
      this.$router.push({
        path: '/home/calculate/detail',
        query: {
          region: this.$route.query.region
        }
      })
    },
    async mapClick(params) {
      console.log(params)
      switch (params.seriesType) {
        case 'map':
          this.region = params.name;
          // const [lng, lat] =  params.__map_position
          this.$router.push({
            path: '/home/detail/county',
            query: {
              region: params.name,
            }
          })
          break;
        case 'custom':
          if (params.data.property) {
            // 地块点击
            let id = params.data.property.properties.id
            let type = params.data.property.properties.type
            if(type === 'EP') {
              const res = await service('get', `/project/info/ep/${id}`, {})
              if (res.status === 200) {
                // 地图实景
                const imagesRes = await service('get', `project/images/${id}`, {})
                if (imagesRes.status === 200) {
                  this.property = res.data
                  this.property.type = params.data.property.properties.type
                  this.property.imagesList = imagesRes.data
                  this.showDialog = true;
                } else {
                  this.$message.error(res.message)
                }
              } else {
                this.$message.error(res.message)
              }
            } else {
              const res = await service('get', `/project/info/vep/${id}`, {})
              if (res.status === 200) {
                // 地图实景
                const imagesRes = await service('get', `project/images/${id}`, {})
                if (imagesRes.status === 200) {
                  this.property = res.data
                  this.property.type = params.data.property.properties.type
                  this.property.imagesList = imagesRes.data
                  this.showDialog = true;
                } else {
                  this.$message.error(res.message)
                }
              } else {
                this.$message.error(res.message)
              }
            }
          } else {
            // 柱子点击
            if (params.name) {
              this.region = params.name
            } else {
              this.region = `浙江省湖州市${params.data[2].name}`
            }
            this.init()
          }
          break;
        case 'scatter':
          // // 柱子点击
          // if (params.name) {
          //     this.region = params.name
          // } else {
          //     this.region = `浙江省湖州市${params.data[2].name}`
          // }
          // this.init()
          break;

      }
    },
    searchProjectList (data) {
      this.getProjectList(data)
    },
    // 项目列表
    async getProjectList(filterData) {
      this.projectLoading = true;
      const res = await service('post', 'project/map/list', {
        region: this.region,
        name: filterData ? filterData.name : '',
        type: filterData ? filterData.type : '',
      })
      this.projectLoading = false
      if (res.status === 200) {
        this.projectList = res.data
      }
    },
    // 获取应用列表
    async getApp() {
      const res = await service('get', 'project/application', {})
      if (res.status === 200) {
        this.applicationList = res.data.map(item => {
          let data = {
            name: item.name,
            value: item.amount,
            percent: item.percent
          }
          if(data.name === '土地出让') {
            data.path = '/home/detail/landTransfer'
          }
          return data
        })
      }
    },
    // 新闻列表
    async getNewsList() {
      const res = await service('get', 'news/list', {
        region: this.region
      })
      if (res.status === 200) {
        this.newsList = res.data
      }
    },
    // 基于行政区划的项目统计
    async getData(region, cb) {
      const res = await service('get', 'project/map/region/stat', {
        year: this.year,
        parent: region ? region : this.region,
        type: this.statisticType
      })
      if (res.status === 200) {
        if (cb) {
          cb(res)
        } else {
          this.statisticData = res.data
          this.$nextTick(() => {
            this.$refs.statistic.initEcharts();
          })
        }
      }
    },
    // 获取地图geo
    async getMapProjectAreaGeoJson() {
      const res = await service('get', 'project/map/geojson', {
        region: this.region
      })
      if (res.status === 200) {
        if (res.data) {
          this.$nextTick(() => {
            const coordinates = JSON.parse(res.data)
            console.log(coordinates)
            this.$refs.map.initMap(coordinates.features)
          })
          // let jsonData = JSON.parse(res.data)
        }
      }
    },
    changeYear(params) {
      this.year = params.year
      this.statisticType = params.type
      this.getData()
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
      this.isFullscreen = state
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
      var isFull = document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull;
    },
    changeScreen() {
      this.fullscreen();
      this.changeFull(!this.screen);
    },
  }
}
</script>

<style lang="less" scoped>
.page {
  background-image: url("../../assets/images/common/body-bg.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  min-height: 100vh;

  &.fullscreen {
    .map-wrapper {
      min-height: calc(~"100vh - 0px");
    }
  }

  &-container {
    //padding: 20px 30px 20px 40px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    &__section {
      width: 612px;
      height: inherit;
      background-size: 100% 100%;
      background-image: url("../../assets/images/common/section.png");
      background-repeat: repeat;
      background-position: 0 0;
      position: relative;
      margin-top: 25px;

      &:after {
        content: "";
        width: 612px;
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
    }

    .map {
      margin: 0 auto;

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
        min-height: calc(~"100vh - 100px");
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

.calculate-btn {
  width: 99px;
  height: 101px;
  background: url("../../assets/images/common/icon-hs.png") no-repeat 0 0;
  background-size: cover;
  position: absolute;
  left: -190px;
  top: -10px;
  cursor: pointer;
  line-height: 101px;
  color: #fff;
  font-size: 14px;
  font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
  font-weight: normal;
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
      color: #FFFFFF;
      line-height: 22px;
    }
  }
}
</style>
