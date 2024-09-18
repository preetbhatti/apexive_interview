# -*- coding: utf-8 -*-

from odoo import models, fields, api


class HrAttendance(models.Model):
    _inherit = "hr.attendance"

    project_id = fields.Many2one('project.project', string='Project', readonly=True)
    task_id = fields.Many2one('project.task', string='Task', readonly=True)
    todo = fields.Text(string="To Do", readonly=True)
    update = fields.Text(string="Update", readonly=True)
