/* @odoo-module */

import { Component, useState } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { isIosApp } from "@web/core/browser/feature_detection";
import { ActivityMenu } from "@hr_attendance/components/attendance_menu/attendance_menu";

patch(ActivityMenu.prototype, {

    setup() {
        super.setup();
        // initialize state of project and task
        this.state = useState({
            projects: [],
            tasks: [],
        });
    },

    async searchReadEmployee() {
        await super.searchReadEmployee();
        // Update the state of project and task based on data from rpc call
        this.state.projects = this.employee.projects
        this.state.tasks = []
    },

    onSelectionProject(ev) {
        // Filter the task based on selected project
        this.state.tasks = this.employee.tasks.filter((task) => task.project_id[0] == parseInt(ev.target.value));
    },

    /**
     * @override
     Override the method for project/task validation and pass the data for attendance record
     */
    async signInOut() {
        var project_task_data = this.prepareProjectTaskData()
        if(project_task_data){
            // iOS app lacks permissions to call `getCurrentPosition`
            if (!isIosApp()) {
                navigator.geolocation.getCurrentPosition(
                    async ({coords: {latitude, longitude}}) => {
                        var res = await this.rpc("/hr_attendance/systray_check_in_out", {
                            latitude,
                            longitude,
                            project_task_data
                        })
                        if(this.validateResponse(res)) {
                            await this.searchReadEmployee()
                        }
                    },
                    async err => {
                        var res = await this.rpc("/hr_attendance/systray_check_in_out", {
                            project_task_data
                        })
                        if(this.validateResponse(res)) {
                            await this.searchReadEmployee()
                        }
                    },
                    {
                        enableHighAccuracy: true,
                    }
                )
            } else {
                var res = await this.rpc("/hr_attendance/systray_check_in_out", {
                    project_task_data
                })
                if(this.validateResponse(res)) {
                    await this.searchReadEmployee()
                }
            }
        }
    },

    validateResponse(res) {
        if('error' in res) {
            alert(res.error)
            return false
        }
        return true
    },

    prepareProjectTaskData() {
        var data = {}
        if(this.state.checkedIn) {
            if(!$('#update').val().trim()) {
                alert("Please add the update before check out")
                return false
            }
            data['update'] = $('#update').val().trim()
        } else {
            if(!$('#todo').val().trim()) {
                alert("Please add to-do list before check in")
                return false
            }
            data['todo'] = $('#todo').val().trim()
            if(this.state.projects) {
                if(!parseInt($('#projects_list').val())) {
                    alert("Please select Project before check in")
                    return false
                }
                if(!parseInt($('#tasks_list').val())) {
                    alert("Please select task before check in")
                    return false
                }
                Object.assign(data, {'project_id': parseInt($('#projects_list').val()),'task_id': parseInt($('#tasks_list').val())});
            }
        }
        return data
    },
})