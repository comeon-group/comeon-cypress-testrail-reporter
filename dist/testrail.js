"use strict";
var globalRunId = null;
Object.defineProperty(exports, "__esModule", {value: true});
var axios = require('axios');
var chalk = require('chalk');
var TestRail = /** @class */ (function () {
    function TestRail(options) {
        this.options = options;
        this.includeAll = true;
        this.caseIds = [];
        this.base = "https://" + options.domain + "/index.php?/api/v2";
    }
     
    /**
     * To work around a Cypress issue where Mocha exits before async requests
     * finish, we use the deasync library to ensure our axios promises
     * actually complete. For more information, see:
     * https://github.com/cypress-io/cypress/issues/7139
     * @param promise A `finally` condition will be appended to this promise, enabling a deasync loop
     */
    TestRail.prototype.makeSync = function (promise) {
        var _this = this;
        var done = false;
        var result = undefined;
        (function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promise.finally(function () { return done = true; })];
                case 1: return [2 /*return*/, result = _a.sent()];
            }
        }); }); })();
        deasync.loopWhile(function () { return !done; });
        return result;
    };
    
    TestRail.prototype.getCases = function (suiteId) {
        var url = this.base + "/get_cases/" + this.options.projectId + "&suite_id=" + suiteId;
        if (this.options.typeId) {
            url += "&type_id=" + this.options.typeId;
        }
        return axios({
            method: 'get',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            auth: {
                username: this.options.username,
                password: this.options.password
            }
        })
            .then(function (response) {
            return response.data.map(function (item) { return item.id; });
        })
            .catch(function (error) { return console.error(error); });
    };


    TestRail.prototype.createRun = function (name, description) {
        if (globalRunId == null) {
            var _this = this;
            if (this.options.includeAllInTestRun === false) {
                this.includeAll = false;
                this.caseIds = this.getCases(this.options.suiteId);
            }
            axios({
                method: 'post',
                url: this.base + "/add_run/" + this.options.projectId,
                headers: {'Content-Type': 'application/json'},
                auth: {
                    username: this.options.username,
                    password: this.options.password,
                },
                data: JSON.stringify({
                    suite_id: this.options.suiteId,
                    name: name,
                    description: description,
                    include_all: this.includeAll,
                    case_ids: [5208,5215,5216,5209,5626,5712,5519,5520,5521,5522,5529,5560,5561,5707,5496,5729,5730,5731,5732,5734,5735,5736,5737,5739,5741,5716,5717,5718,5719,5187,5196,5194,5186,5566,5562,5575,5576,5198,5199,5200,5201,5202,5203,5204,5205,5206,5207,5545,5502,5503,5504,5505,5506,5507,5512,5514,5534,5537,5546,5547,5548,5549,5508,5509,5510,5511,5517,5518,5627,5642,5649,5650,5651,5652,5653,5654]
                    //case_ids: this.caseIds
                }),
            })
                .then(function (response) {
                    _this.runId = response.data.id;
                    globalRunId = response.data.id
                })
                .catch(function (error) {
                    return console.error(error);
                });
        };
    };
    TestRail.prototype.deleteRun = function () {
        axios({
            method: 'post',
            url: this.base + "/delete_run/" + globalRunId,
            headers: {'Content-Type': 'application/json'},
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
        }).catch(function (error) {
            return console.error(error);
        });
    };
    TestRail.prototype.publishResults = function (results) {
        var _this = this;
        axios({
            method: 'post',
            url: this.base + "/add_results_for_cases/" + globalRunId,
            headers: {'Content-Type': 'application/json'},
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
            data: JSON.stringify({results: results}),
        })
            .then(function (response) {
                console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
                console.log('\n', " - Results are published to " + chalk.magenta("https://" + _this.options.domain + "/index.php?/runs/view/" + globalRunId), '\n');
            })
            .catch(function (error) {
                return console.error(error);
            });
    };
    return TestRail;
}());
exports.TestRail = TestRail;
//# sourceMappingURL=testrail.js.map
