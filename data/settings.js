var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

var SettingsData = {
    updateSettings: function (archive_view, about_section, callback) {
        db.query('UPDATE nn."Settings" SET archive_view=$1, about_section=$2;',
            [archive_view, about_section], (err, qres) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, qres);
                }
            })
    },
    getSettings: function (callback) {
        db.query('SELECT id, archive_view, about_section FROM nn."Settings";',
            [], (err, qres) => {
                if (err) {
                    callback(err, null);
                } else {
                    let data = qres.rows[0];
                    callback(null, data);
                }
            })
    },
    insertDefaultSettings: function (callback) {
        let defaultSettings = ['date', 'TODO, fill out your about section in the admin settings page.'];
        db.query('INSERT INTO nn."Settings"(id, archive_view, about_section) '
            + 'VALUES (uuid_generate_v1(), $1, $2);',
            defaultSettings, (err, qres) => {
                if (err) {
                    callback(err, null);
                } else {

                    callback(null, { 'defaultSettings': defaultSettings, 'result': qres });
                }
            })
    }
}

module.exports = SettingsData;