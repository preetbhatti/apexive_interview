# -*- coding: utf-8 -*-
{
    'name': "hr_attendance_custom",

    'summary': "Select Project/task before checkin",

    'description': """
        - Select a Project: Users should be able to choose a specific project while checking in.
        - Select a Project Task: Along with selecting a project, users should also be able to select a specific task related to the chosen project.
        - Write Descriptions: Enable users to add a description for their activities during both check-in and check-out.
    """,

    'author': "My Company",
    'website': "https://www.yourcompany.com",

    # for the full list
    'category': 'Uncategorized',
    'version': '17.0.0.0',

    # any module necessary for this one to work correctly
    'depends': ['hr_attendance', 'project'],

    'data': [
        "views/views.xml",
    ],

    'assets': {
        'web.assets_backend': [
            'hr_attendance_custom/static/src/xml/attendance.xml',
            'hr_attendance_custom/static/src/js/attendance.js',
        ],
    },

}
