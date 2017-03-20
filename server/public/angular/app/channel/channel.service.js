/**
 * Created by Ibrahim on 20/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.channel')
    .service('ChannelService', ChannelServiceFN);

  ChannelServiceFN.$inject = ['ChannelFactory', '$http'];

  /* @ngInject */
  function ChannelServiceFN(ChannelFactory, $http) {


    this.addChannel = addChannelFN;
    this.updateChannel = updateChannelFN;
    this.deleteChannel = deleteChannelFN;
    this.getChannelByID = getChannelByIDFN;
    this.getChannelsByUser = getChannelsByUserFN;



    function addChannelFN(channel) {
      //channel = new ChannelFactory(channel);
      return ChannelFactory.save(channel).$promise;
    }

    function updateChannelFN(channel) {
      console.log(ChannelFactory.update({id: channel.id}, channel));
      console.log("Updated");
    }

    function deleteChannelFN(channel) {
      return channel.$delete();
    }


    function getChannelByIDFN(idChannel) {
      //console.log('id channel',idChannel);
      // console.log(ChannelFactory.get({id:idChannel}));
      return ChannelFactory.get({id: idChannel});
    }


    function getChannelsByUserFN(userId) {

      return ChannelFactory.getChannelsByUser({userId: userId}).$promise;
    }



  }

})();
