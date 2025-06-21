<template>
    <div class="page" @click="closeDialog" :class="{fullscreen: isFullscreen}">
        <div ref="pageHeader">
            <page-header></page-header>
        </div>
        <div class="btn-back">
            <back></back>
        </div>
        <div class="page-container" ref="pageContainer">
            <Left :open="openLeft" @toggle="toggleLeftHandler">
                <div class="map-logo">
                    <img src="../../assets/images/common/map-logo.png" alt="">
                </div>
                <section class="page-container__section">
                    <page-title>地块列表</page-title>
                    <land-list :list="projectList" :item-id="selection.id" @listClick="listClickHandler"></land-list>
                </section>
                <section class="page-container__section">
                    <page-title>地块实景</page-title>
                    <template v-if="imageList.length > 0">
                        <swiper ref="mySwiper" :options="swiperOptions">
                            <swiper-slide v-for="(item, index) in imageList" :key="index">
                                <div class="reality">
                                    <div class="reality-container">
                                        <div class="reality-container__img">
                                            <viewer :images="[item]">
                                                <img :src="item" alt="">
                                            </viewer>
                                            <div class="reality-container__img__tip">
                                                #地块实景#
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </swiper-slide>
                            <div class="swiper-pagination" slot="pagination"></div>
                        </swiper>
                    </template>
                    <div class="reality-empty" v-else>
                        <empty></empty>
                    </div>
                </section>
            </Left>

            <div class="map">
                <div class="map-wrapper">
                    <map-core ref="map" @drawEnd="dragendHandler"></map-core>
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
                <section class="page-container__section">
                    <page-title>EP核算结果</page-title>
                    <accounting-results :list="accountingResultsList"
                                        v-loading="EPLoading"
                                        element-loading-text="加载中..."
                                        element-loading-spinner="el-icon-loading"
                                        element-loading-background="rgba(0, 0, 0, 0.8)"></accounting-results>
                </section>
                <section class="page-container__section">
                    <page-title>资源统计</page-title>
                    <resource-statistics :list="resourceStatisticList"></resource-statistics>
                </section>
            </Right>
        </div>

        <loading ref="loading" v-show="showLoading"></loading>
        <form-dialog ref="formDialog" v-show="showFormDialog" @close="showFormDialog = false" @submit="submitCalculate"></form-dialog>
    </div>
</template>

<script>
import pageHeader from '@/components/header'
import pageTitle from '@/components/title'
import Left from '@/components/left'
import Right from '@/components/right'
import accountingResults from './subs/accountingResults'
import resourceStatistics from './subs/resourceStatistics'
import service from '@/api'
import screenfull from "screenfull";
import landList from './subs/landList'
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import empty from '@/components/empty'
import back from '@/components/back'
import dsForm from '@/components/business/ds-form'
import mapCore from '@/components/map'
import loading from '@/components/loading'
import formDialog from '@/components/business/formDialog'

export default {
    components: {
        pageHeader,
        pageTitle,
        accountingResults,
        Left,
        Right,
        resourceStatistics,
        landList,
        Swiper,
        SwiperSlide,
        empty,
        back,
        dsForm,
        mapCore,
        loading,
        formDialog
    },
    data() {
        return {
            projectList: [],
            accountingResultsList: [
                {name: '水源涵养(万立方米/年)', value: '-', kbValue: '-', key: 'syhy'},
                {name: '土壤保持(万吨/年)', value: '-', kbValue: '-', key: 'trbc',},
                {name: '洪水调蓄 (万立方米/年)', value: '-', kbValue: '-', key: 'hstx'},
                {name: '固碳(万吨/年)', value: '-', kbValue: '-', key: 'gt'},
                {name: '释氧(万吨/年)', value: '-', kbValue: '-', key: 'sy'},
                {name: '气候调节(万立方米/年)', value: '-', kbValue: '-', key: 'qhtj'},
                {name: '水质净化(吨/年)', value: '-', kbValue: '-', key: 'shjjh'},
                {name: '空气净化(吨/年)', value: '-', kbValue: '-', key: 'kqjh'},
                {name: '调节服务价值总量(万元)', value: '-', kbValue: '-', key: 'tiaojie'},
                {name: '单位面积调节服务价值EP(元/平方米)', value: '-', kbValue: '-', key: 'ep'},
                {name: '地块出让价格(万元)', value: '-', kbValue: '-', key: 'crjg'},
                {name: '地块增值金(万元)', value: '-', kbValue: '-', key: 'crzzj'},
            ],
            resourceStatisticList: [
                {name: '森林生态系统', area: '-', percent: '-'},
                {name: '灌从生态系统', area: '-', percent: '-'},
                {name: '草地生态系统', area: '-', percent: '-'},
                {name: '湿地生态系统', area: '-', percent: '-'},
                {name: '农田生态系统', area: '-', percent: '-'},
                {name: '城镇生态系统', area: '-', percent: '-'},
            ],
            newsList: [],
            openLeft: true,
            openRight: true,
            isFullscreen: false,
            year: 2023,
            statisticData: [],
            // 项目区域
            region: '浙江省湖州市安吉县',
            huzhouMapJson: {},
            mapData: [],
            swiperOptions: {
                direction: 'horizontal',
                pagination: {
                    el: ".swiper-pagination",
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                slidesPerView: 1,
                spaceBetween: 0,
                centeredSlides: true,
                // 设置轮播可循环
                loop: false,
                on:{
                    slideChangeTransitionEnd: () => {
                    }
                },
                // Some Swiper option/callback...
            },
            isPlay: false,
            isCalculate: false,
            isParamsUpdate: false,
            selection: {},
            imageList: [],
            showLoading: false,
            EPLoading: false,
            showFormDialog: false,
        }
    },
    computed: {
        totalValue() {
            return this.a.reduce((pre, cur, index) => {
                return pre + cur.value
            }, 0)
        },
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    mounted() {
        window.addEventListener('resize', this.judgeCurrentScreen)
        this.getDistrictRasterTile();
        // this.getMapGeoJson();
        this.getMapDataGeojson();
        this.init()
    },
    methods: {
        // 获取指定区域影像地图
        async getDistrictRasterTile() {
            const res = await service('get', 'district/raster/tile', {
                region: '浙江省湖州市安吉县'
            })
            if (res.status === 200) {
                this.$nextTick(() => {
                    console.log(res.data.url)
                    this.$refs.map.setBaseTile(res.data.url);
                })
            }
            this.getVectorTile()
        },
        async getVectorTile () {
            const res = await service('get', 'district/vector/tile', {
                region: '浙江省湖州市安吉县'
            })
            if (res.status === 200) {
                this.$refs.map.setBaseVecotrTile(res.data.url)
            }
        },
        // 获取地图geo
        async getMapGeoJson() {
            const parent = '浙江省湖州市'
            const res = await service('get', 'district/geojson', {
                parent: parent
            })
            if (res.status === 200) {
                if (res.data) {
                    let jsonData = JSON.parse(res.data)
                    jsonData.features = jsonData.features.filter(item => item.properties.name === '浙江省湖州市安吉县')
                    this.$refs.map.setRegion(jsonData)
                }
            }
        },
        // 获取地图geo
        async getMapDataGeojson() {
            console.log(this.selection)
            const res = await service('get', 'project/map/geojson', {
                region: this.region,
                id: this.selection.id
            })
            if (res.status === 200) {
                if (res.data) {
                    let jsonData = JSON.parse(res.data)
                    // jsonData.features = jsonData.features.filter(item => item.properties.name === '浙江省湖州市安吉县')
                    this.$refs.map.showPolygon(jsonData)
                }
            }
        },
        dragendHandler (json) {
            this.geometry = json
            console.log('json', json)
        },
        draw (e) {
            this.$refs.map.startDrawPolygon(e);
        },
        drawRect (e) {
            this.$refs.map.startDrawRect(e);
        },
        listClickHandler (item) {
            this.selection = item;
            this.projectID = item.id
            this.ecosystem();
            this.getImages();
            this.getEP();
            this.getMapDataGeojson();
            this.getMapReady();
        },
        async getMapReady () {
            const res = await service('get', '/getmapReady', {
                name: this.selection.name,
            }, 'webserver')
            if(res.status === 200) {
                this.$refs.map.showResult(res.data.items.url)
            }
        },
        async toggleCalculate () {
            if(!this.geometry) {
                this.$message.error('请绘制地块')
                return
            }
            this.showFormDialog = true;
        },
        async submitCalculate (modelValue) {
            if(this.isCalculate) return
            this.isCalculate = true
            // const modelValue = this.$refs.dsForm.getModelValue();
            const res = await service('post', '/projectEP', {
                ...this.geometry,
                region: this.region,
                projectName: modelValue.projectName
            }, 'geo_calc')
            this.isCalculate = false
            if(res.status === 0) {
                this.projectID = res.data.projectID;
                // this.projectID = 'a8fca39b-dc63-481f-b837-de98bf718195'

                // 计算结果演示效果
                this.showLoading = true;
                this.$nextTick(async() => {
                    this.$refs.loading.start()
                    await this.getCalcResultProgress()
                })
            } else {
                // this.projectID = 'a8fca39b-dc63-481f-b837-de98bf718195'
                // 计算结果演示效果
                // this.showLoading = true;
                // this.$nextTick(async() => {
                //     this.$refs.loading.start()
                //     await this.getCalcResultProgress()
                // })
                this.$refs.map.clearDraw()
                this.$message.error(res.msg)
            }
        },
        // 实时进度查询
        async getCalcResultProgress () {
            const res = await service('get', '/status', {
                task_id: this.projectID
            }, 'geo_calc')
            if(res.state == 'SUCCESS') {
                this.$refs.loading.done()
                setTimeout(() => {
                    this.showLoading = false
                }, 1500)
                this.getCalcResult();
            } else {
                setTimeout(() => {
                    this.getCalcResultProgress()
                }, 3000)
            }
            // this.$refs.map.clearDraw()
            // this.$refs.loading.done()
            // this.showLoading = false
            // this.$message.error(res.msg)
        },
        // EP计算结果
        async getCalcResult () {
            this.EPLoading = true
            const res = await service('get', '/calResult', {
                task_id: this.projectID
            }, 'geo_calc')
            this.EPLoading = false
            if(res.status === 0) {
                this.$message.success('EP核算成功！')
                if(res.data && res.data.items && res.data.items.length > 0) {
                    const tjfw = res.data.items[0].tjfw
                    this.accountingResultsList.forEach(item => {
                        item.value = tjfw[item.key]
                        item.kbValue = tjfw[`${item.key}_jz`]
                    })
                    this.$nextTick(() => {
                        this.$refs.map.showResult(res.data.items[0].url)
                    })
                }
            } else {
                this.$message.error(res.msg)
            }
        },
        toggleParamsUpdate () {
            this.isParamsUpdate = !this.isParamsUpdate
        },
        togglePlay () {
            this.isPlay = !this.isPlay
        },
        init () {
            // this.getData();
            this.getProjectList();
        },
        mapClick (name) {
            this.region = name;
            this.init()
        },
        // 项目列表
        async getProjectList() {
            const res = await service('post', 'project/map/list', {
                region: '浙江省湖州市',
                type: 'EP'
            })
            if (res.status === 200) {
                this.projectList = res.data
                // this.selection = res.data[0]
                this.ecosystem();
                this.getImages();
                this.getEP();
            }
        },
        // 资源统计
        async ecosystem() {
            const res = await service('get', `project/ecosystem/${this.selection.id}`, {})
            if (res.status === 200) {
                this.resourceStatisticList.forEach(item => {
                    res.data.forEach(sub => {
                        if(item.name === sub.name) {
                            item.area = sub.area
                            item.percent = sub.percent
                        }
                    })
                })
            }
        },
        // EP核算结果
        async getEP() {
            this.EPLoading = true
            const res = await service('get', `project/details/${this.selection.id}`, {})
            this.EPLoading = false
            if (res.status === 200) {
                this.accountingResultsList.forEach(item => {
                    item.value = res.data[item.key]
                    item.kbValue = res.data[`${item.key}_jz`]
                })
            }
        },
        // 地图实景
        async getImages() {
            const res = await service('get', `project/images/${this.selection.id}`, {})
            if (res.status === 200) {
                this.imageList = res.data;
            }
        },
        // 基于行政区划的项目统计
        async getData(region, cb) {
            const res = await service('get', 'project/region/stat', {
                year: this.year,
                parent: region ? region : this.region
            })
            if (res.status === 200) {
                if(cb) {
                    cb(res)
                } else {
                    this.statisticData = res.data
                    this.$nextTick(() => {
                        this.$refs.statistic.initEcharts();
                    })
                }
            }
        },
        changeYear (year) {
            this.year = year
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
    background-image: url("../../assets/images/common/bg.png");
    background-repeat: repeat;
    background-position: 0 0;
    min-height: 100vh;

    &.fullscreen {
        .map-wrapper {
            min-height: calc(~"100vh - 120px");
        }
    }

    &-container {
        box-sizing: border-box;
        position: relative;
        overflow: hidden;

        &__total {
            font-size: 14px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #FFFFFF;
            line-height: 20px;
            display: flex;
            align-items: center;
            justify-items: center;
            justify-content: center;
            margin-top: 25px;
            margin-bottom: 5px;
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
        }

        .map {
            margin: 0 auto;
            position: relative;
            z-index: 0;

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
                background: url("../../assets/images/county/icon-draw.png") no-repeat 0 0;
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
                background: url("../../assets/images/county/icon-draw-rect.png") no-repeat 0 0;
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
                background: url("../../assets/images/county/icon-stop.png") no-repeat 0 0;
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
                background: url("../../assets/images/county/icon-play.png") no-repeat 0 0;
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
        box-shadow: 0px 0px 8px 0px rgba(72,129,255,0.58);
        background: linear-gradient(171deg, rgba(72, 129, 255, 0.65), rgba(72, 129, 255, 0.36), rgba(72, 129, 255, 0.54), rgba(72, 129, 255, 0.65), rgba(72, 129, 255, 1)) 1 1;
        font-size: 14px;
        font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
        border-radius: 25px;
        margin-bottom: 24px;
        cursor: pointer;

        &.primary {
            background: rgba(72,129,255,0.52);
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

.reality {

    &-empty {
        height: 340px;
    }

    &-container {
        margin: 20px auto 37px;

        &__img {
            width: 470px;
            height: 290px;
            background: #ccc;
            margin: 0 auto;
            position: relative;

            img {
                width: 100%;
                height: 100%;
            }

            &__tip {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(42, 112, 253, 0.83);
                font-size: 14px;
                font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
                font-weight: normal;
                color: #FFFFFF;
                line-height: 20px;
            }
        }
    }
}

.swiper-container {
    /deep/ .swiper-pagination-bullets {
        .swiper-pagination-bullet {
            width: 31px;
            height: 4px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 3px;

            &.swiper-pagination-bullet-active {
                background: rgba(41, 148, 212, 1);
            }
        }
    }
}

.btn-back {
    position: relative;
    height: 35px;
    margin-top: -10px;
}
</style>
