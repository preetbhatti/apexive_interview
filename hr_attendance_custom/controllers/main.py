# -*- coding: utf-8 -*-

from odoo.http import request
from odoo.addons.hr_attendance.controllers.main import HrAttendance


class HrAttendanceCustom(HrAttendance):

    def user_attendance_data(self):
        res = super(HrAttendanceCustom, self).user_attendance_data()
        open_tasks = request.env['project.task'].search(
            [('user_ids', 'in', request.env.user.id), ('project_id', '!=', False), (
                'state', 'in', ['01_in_progress', '02_changes_requested', '03_approved', '04_waiting_normal'])])
        if open_tasks:
            res['tasks'] = open_tasks.read(['name', 'project_id'])
            res['projects'] = open_tasks.project_id.read(['name'])
        return res

    def systray_attendance(self, latitude=False, longitude=False, project_task_data=False):
        employee = request.env.user.employee_id
        if not project_task_data or not all(project_task_data.values()):  # validation
            return {
                'error': 'Please select project/task and add to-do list before check in' if employee.attendance_state != 'checked_in' else 'Please add the update before check out'}
        res = super(HrAttendanceCustom, self).systray_attendance(latitude=latitude, longitude=longitude)
        domain = [('employee_id', '=', employee.id), ('check_out', '!=', False)]
        if res['attendance_state'] == 'checked_in':
            domain = [('employee_id', '=', employee.id), ('check_out', '=', False)]
        attendance = request.env['hr.attendance'].search(domain, limit=1, order='create_date desc')
        if attendance and project_task_data:
            attendance.write(project_task_data)
        return res
