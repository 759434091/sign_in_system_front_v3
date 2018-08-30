<template>
    <el-container>
        <el-header>
            <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <li class="idx-menu-brand">&emsp;Happy&nbsp;Sign&nbsp;In&emsp;</li>
                <li class="idx-menu-datetime" v-html="this.formatDateTime"></li>
                <el-menu-item class="idx-menu-item" index="1">
                    {{userName}}
                    <i style="vertical-align: -2px" class="el-icon-setting"></i>
                </el-menu-item>
                <li class="idx-menu-greeting" v-text="`${this.getGreetMsg()}`"></li>
            </el-menu>
        </el-header>
        <el-container class="idx-second-container">
            <el-aside width="300px">
                <el-menu class="idx-second-menu" background-color="#828A92" text-color="#fff"
                         active-text-color="#464E56">
                    <el-menu-item index="1">处理中心</el-menu-item>
                </el-menu>
            </el-aside>
            <el-main class="idx-main">
                Main
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'index',
        computed: {
            formatDateTime() {
                const year = this.date.getFullYear()
                const month = (this.date.getMonth() + 1) < 10 ? `0${this.date.getMonth() + 1}` : this.date.getMonth() + 1
                const day = this.date.getDay() < 10 ? `0${this.date.getDay()}` : this.date.getDay()
                const hour = this.date.getHours() < 10 ? `0${this.date.getHours()}` : this.date.getHours()
                const minute = this.date.getMinutes() < 10 ? `0${this.date.getMinutes()}` : this.date.getMinutes()
                const second = this.date.getSeconds() < 10 ? `0${this.date.getSeconds()}` : this.date.getSeconds()
                const week = null == this.week || this.week <= 0 ? '' : `第${this.week}周`
                return `${year}年${month}月${day}日
                        ${hour}:${minute}:${second}
                        ${week}`
            }
        },
        data() {
            return {
                date: new Date(),
                timer: null,
                week: 0,
                userName: "卢学能"
            }
        },
        created() {
            this.$request.getWeek()
                .then(res => {
                    if (!res.data.week)
                        return
                    this.week = res.data.week
                })
                .catch(err => {
                    console.error(err);
                })
            const _this = this;
            this.timer = setInterval(function () {
                _this.date = new Date();
            }, 1000);
        },
        beforeDestroy() {
            if (this.timer)
                clearInterval(this.timer)
        },
        methods: {
            getGreetMsg() {
                const hour = this.date.getHours();

                if (hour >= 0 && hour < 6)
                    return '凌晨时间，请注意休息哦'
                if (hour >= 6 && hour < 12)
                    return '早上好'
                if (hour >= 12 && hour < 13)
                    return '中午好'
                if (hour >= 13 && hour < 19)
                    return '下午好'
                if (hour >= 19 && hour < 20)
                    return '傍晚好'
                if (hour >= 20 && hour < 24)
                    return '晚上好'
                return ''
            }
        }
    }
</script>

<style>
    .idx-second-container {
        margin-top: 8px;
    }

    .idx-second-menu {
        margin-left: 20px;
        height: calc(100vh - 24px - 60px);
    }

    .idx-main {
        margin-right: 20px;
        padding: 10px 20%;
        background-color: gray;
    }

    .idx-menu-brand {
        float: left;
        height: 60px;
        width: 240px;
        text-align: center;
        font-size: 1.5rem;
        line-height: 60px;
        padding: 0 20px;
        margin: 0;
        color: rgb(255, 255, 255);
        background-color: rgb(67, 74, 80);
        border-bottom-color: transparent;
    }

    .idx-menu-datetime {
        float: left;
        height: 60px;
        line-height: 60px;
        letter-spacing: 0.3rem;
        padding: 0 20px;
        margin: 0;
        color: rgb(255, 255, 255);
        background-color: #545c64;
        border-bottom-color: transparent;
    }

    .idx-menu-datetime:focus, .idx-menu-greeting:focus {
        outline: unset;
    }

    .idx-menu-greeting {
        float: right;
        height: 60px;
        line-height: 60px;
        padding: 0 20px;
        color: rgb(255, 255, 255);
        background-color: #545c64;
        border-bottom-color: transparent;
    }

    .idx-menu-item {
        float: right !important;
    }
</style>
