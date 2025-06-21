<template>
    <div class="count-up" ref="countUp">0</div>
</template>

<script>
export default {
    name: 'zy-count-up',
    props: {
        countUpNumber: {
            default: '999.999'
        }
    },
    data() {
        return {}
    },
    mounted() {
        this.$nextTick(() => {
            this.setVars()
            this.init()
        })
    },
    methods: {
        setVars() {
            this.number = [this.$refs.countUp];
            const countUpNumber = typeof this.countUpNumber === 'string' ? this.countUpNumber : this.countUpNumber.toString()
            this.observerOptions = {root: null, rootMargin: "0px 0px", threshold: 0};
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const end = parseFloat(
                        countUpNumber.replace(/,/g, "")
                    );
                    const decimals = this.countDecimals(end);
                    if (entry.isIntersecting) {
                        this.iterateValue(entry.target, end, decimals);
                    }
                });
            }, this.observerOptions);
        },

        init() {
            if (this.number.length > 0) {
                this.number.forEach((el) => {
                    this.observer.observe(el);
                });
            }
        },

        iterateValue(el, end, decimals) {
            const start = 0;
            const duration = 2500;
            let startTimestamp = null;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const elapsedPercent = (timestamp - startTimestamp) / duration;
                const easedProgress = Math.min(this.easeOutQuint(elapsedPercent), 1);
                let interimNumber = Math.abs(easedProgress * (end - start) + start);
                el.innerHTML = this.formatNumber(interimNumber, decimals);
                if (easedProgress < 1) {
                    window.requestAnimationFrame(step);
                }
            };

            // requestAnimationFrame returns DOMHighResTimeStamp as a callback (used as timestamp)
            window.requestAnimationFrame(step);
        },

        easeOutQuad(x) {
            return 1 - Math.pow(1 - x, 3);
        },

        easeOutQuint(x) {
            return 1 - Math.pow(1 - x, 5);
        },

        countDecimals(val) {
            if (Math.floor(val) === val) return 0;
            return val.toString().split(".")[1].length || 0;
        },

        formatNumber(val, decimals) {
            return val.toLocaleString("en-US", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }
    }
}
</script>

<style lang="less" scoped>
.count-up {
    //font-size: 16px;
    //color: #fff;
}
</style>