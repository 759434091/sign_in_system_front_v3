<template>
    <el-container>
        <el-header></el-header>
        <el-main>
            <el-table ref="courseTable"
                      class="course-table"
                      border
                      :span-method="spanMethod"
                      :data="tableData"
                      :cell-style="cellStyle"
                      @cell-click="showCozDtl">
                <el-table-column prop="period" label="#">
                    <template slot-scope="scope">
                        <span class="course-title" v-text="scope.row.period"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="mon" label="星期一">
                    <template slot-scope="scope">
                        <span class="course-title" v-text="scope.row.mon.scName"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="tue" label="星期二">
                    <template slot-scope="scope">
                        <span class="course-title" v-text="scope.row.tue.scName"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="wed" label="星期三">
                    <template slot-scope="scope">
                        <span class="course-title" v-text="scope.row.wed.scName"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="thu" label="星期四">
                    <template slot-scope="scope">
                        <span class="course-title" v-text="scope.row.thu.scName"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="fri" label="星期五">
                    <template slot-scope="scope">
                        <span class="course-title" v-text="scope.row.fri.scName"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="sat" label="星期六">
                    <template slot-scope="scope">
                        <span class="course-title" v-text="scope.row.sat.scName"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="sun" label="星期日">
                    <template slot-scope="scope">
                        <span class="course-title" v-text="scope.row.sun.scName"></span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <coz-dialog :course="dialogCourse" :dialogVisible="dialogVisible" @closeDialog="closeDialog"/>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "CourseTable",
        components: {
            CozDialog: () => import('./CozDialog')
        },
        computed: {
            ...mapState({
                week: 'week',
                user: 'user'
            }),
            fortnight() {
                return this.week % 2 === 1 ? 1 : 2
            }
        },
        data() {
            return {
                dayMap: new Map([[1, 'mon'], [2, 'tue'], [3, 'wed'], [4, 'thu'], [5, 'fri'], [6, 'sat'], [7, 'sun']]),
                joinCourseList: [],
                yearEtTerm: '2017-2018-2',
                tableData: [],
                colorMap: new Map(),
                rowSpanMap: new Map(),
                nextColor: 0,
                dialogCourse: null,
                dialogVisible: false
            }
        },
        created() {
            const tempTableData = []
            for (let i = 0; i < 12; i++) {
                tempTableData[i] = {period: i + 1, mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: ''}
            }

            this.$request.student.getCourseTable().then(res => {
                if (!res.data.success) {
                    this.$message.error(res.data.message)
                    return
                }

                this.joinCourseList = res.data.array;
                const courseList = this.joinCourseList.map(joinCourse => joinCourse.sisCourse)
                for (let i = 0; i < courseList.length; i++) {
                    const course = courseList[i];
                    const scheduleList = course.sisScheduleList
                    for (let j = 0; j < scheduleList.length; j++) {
                        const schedule = scheduleList[j];

                        if (this.yearEtTerm !== schedule.ssYearEtTerm ||
                            this.week < schedule.ssStartWeek ||
                            this.week > schedule.ssEndWeek ||
                            (schedule.ssFortnight !== 0 && schedule.ssFortnight !== this.fortnight)) {
                            continue;
                        }

                        for (let k = schedule.ssStartTime; k <= schedule.ssEndTime; k++) {
                            // 跨行数
                            if (k === schedule.ssStartTime) {
                                this.rowSpanMap.set(`${k - 1}_${schedule.ssDayOfWeek}`,
                                    [schedule.ssEndTime - schedule.ssStartTime + 1, 1])
                            } else {
                                this.rowSpanMap.set(`${k - 1}_${schedule.ssDayOfWeek}`,
                                    [0, 0])
                            }
                            // 课程插入tempTable
                            tempTableData[k - 1][this.dayMap.get(schedule.ssDayOfWeek)] = course
                        }
                    }
                }
                this.tableData = tempTableData

            }).catch(err => {
                console.error(err)
                this.$message.error(err)
            })
        },
        mounted() {
            this.$refs.courseTable.$el.getElementsByClassName('el-table__body')[0].setAttribute('cellspacing', '5')
            this.$refs.courseTable.$el.getElementsByClassName('el-table__header')[0].setAttribute('cellspacing', '5')
        },
        methods: {
            spanMethod({rowIndex, columnIndex}) {
                let rowSpan = this.rowSpanMap.get(`${rowIndex}_${columnIndex}`)
                if (rowSpan) {
                    return rowSpan
                }
            },
            cellStyle({row, column}) {
                const colorList = ['#7EA9FB', '#67C23A', '#FEBC50', '#F56C6C', '#A388FC', '#ff3df4', '#00ff9f']
                if (column.property === 'period') {
                    return
                }
                const name = row[column.property]
                if (name == null || name === '') {
                    return
                }
                let color = this.colorMap.get(name)
                if (color == null) {
                    color = colorList[this.nextColor++]
                    this.colorMap.set(name, color)
                    return {
                        backgroundColor: color,
                        cursor: 'pointer',
                        'border-radius': '10px',
                        'box-shadow': `1px 1px 7px ${color}`,
                        'border-bottom': 'none',
                        'z-index': '1'
                    }
                }
                return {
                    backgroundColor: color,
                    cursor: 'pointer',
                    'border-radius': '10px',
                    'box-shadow': `1px 1px 7px ${color}`,
                    'border-bottom': 'none',
                    'z-index': '1'
                }
            },
            showCozDtl(row, column) {
                if (column.property === 'period' || row[column.property] === '' || row[column.property] == null) {
                    return
                }
                this.dialogCourse = row[column.property]
                this.dialogVisible = true
            },
            closeDialog() {
                this.dialogCourse = null
                this.dialogVisible = false
            }
        }
    }
</script>

<style scoped>

</style>