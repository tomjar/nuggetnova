var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

var SettingsData = {
    updateSettings: function (archive_view, about_section, callback) {
        db.query('UPDATE nn."Settings" SET archive_view=$1, about_section=$2;',
            [archive_view, about_section], (err, qres) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(err, qres);
                }
            })
    },
    getSettings: function (callback) {
        db.query('SELECT id, archive_view, about_section FROM nn."Settings";',
            [], (err, qres) => {
                if (err) {
                    callback(err, null);
                } else {

                    if (qres.rows.length <= 0) {
                        callback(null, { 'archive_view': '', 'about_section': '' });
                    } else {
                        let data = qres.rows[0];
                        callback(null, data);
                    }
                }
            })
    }
}

module.exports = SettingsData;