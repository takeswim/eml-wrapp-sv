var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment');
var axios = require('axios');
var config  = require('config');

var util = {
    token: config.get('eml.token'),
    instance: axios.create({
        baseURL: config.get('eml.baseurl'),
        timeout: config.get('eml.timeout')
    }),
    account: config.get('eml.account'),
    // アプリリスト取得
    queryLists: function() {
        return this.instance.get('/api/package_list', {params:{api_key:this.token}})
            .then(function(res) {
                return res.data;
            });
    },
    // PUBタグ検索
    checkPubTag: function(tags) {
        var ii = _.findIndex(tags, function(tag) {
            return tag.indexOf("[PUB]") == 0;
        });
        if (ii<0) {
            return null;
        }
        return tags[ii];
    },
    // 新規分抽出
    filterLatest: function(apps, appname) {
        var self = this;
        return _.chain(apps).sortBy(function(app) {
            return moment(app.created).unix();
        }).reduce(function(result, app){
            var pubtag = self.checkPubTag(app.tags);
            if (pubtag) {
                if (   !appname
                    || (appname && appname === pubtag.slice(5))
                   ) {
                    result[pubtag.slice(5)] = app;
                }
            }
            return result;
        }, {}).map(function(value) {
            return value;
        }).value();
    },
    // インストールリンク作成
    makeInstallButton: function(apps) {
        var self = this;
        return Promise.reduce(apps, function(results, app) {
            return self.instance.get(
                '/api/create_token',
                {
                    params: {
                        api_key:     self.token,
                        id:          app.id,
                        mail:        self.account,
                        expire_hour: 1
                    }
                }).then(function(res) {
                    results.push(res.data);
                    return results;
                });
        }, []);
    },
};

module.exports = function(req, res, next) {
    var appname = _.result(req.query, 'pub', null);
    return util.queryLists()
    .then(function(apps) {
        apps = util.filterLatest(apps, appname);
        return util.makeInstallButton(apps);
    })
    .then(function(apps) {
        res.render('index', {title:config.get('title'), apps: apps});
    })
    .catch(function(err) {
        next(err);
    });
};

// EOF
