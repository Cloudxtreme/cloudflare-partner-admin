'use strict'

var url = 'https://api.cloudflare.com/host-gw.html';

var host_key = "YOUR-HOST-KEY-HERE";
var user_key;

angular.module('app', [])
.controller('MainCtrl', ['$http', function ($http) {

	var vm = this;

	var cloudflare_email = "YOUR-EMAIL-PARTNER-ACCOUNT";
	var cloudflare_pass = "YOUR-PASSWORD";

	var params = 'act=user_auth&' +
				 'cloudflare_email=' + cloudflare_email + '&' +
				 'cloudflare_pass=' + cloudflare_pass + '&' +
				 'host_key=' + host_key;

	$http.post(url, params, {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).then(function(res) {

		user_key = res.data.response.user_key;

		var params = 'act=zone_list&' +
					 'user_key=' + user_key + '&' +
					 'host_key=' + host_key;

		$http.post(url, params, {
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).then(function(res) {
			vm.domains = res.data.response;
		})

	})

	vm.getInfo = function(domain) {

		var params = 'act=zone_lookup&' +
					 'user_key=' + user_key + '&' +
					 'zone_name=' + domain + '&' +
					 'host_key=' + host_key;

		$http.post(url, params, {
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).then(function(res) {
			var info = {};
			info.domain = domain;
			info.hosted_cnames = res.data.response.hosted_cnames;
			info.forward_tos = res.data.response.forward_tos;
			vm.info = info;
		})

	}

}])

.controller('AddCtrl', ['$http', function ($http) {

	var vm = this;

	vm.addDomain = function() {

		var domain = vm.domain;
		var subdomains = vm.subdomains;
		var params = 'act=zone_set&' +
					 'user_key=' + user_key + '&' +
					 'zone_name=' + domain + '&' +
					 'resolve_to=' + domain + '&' +
					 'subdomains=' + subdomains + '&' +
					 'host_key=' + host_key;

		$http.post(url, params, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).then(function() {
			window.location.reload();
		});

	}

}]);
