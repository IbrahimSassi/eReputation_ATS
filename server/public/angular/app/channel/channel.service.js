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
      // channel.dateCreation = new Date();
      console.log("channel",channel);
      return ChannelFactory.save(channel).$promise;
    }

    function updateChannelFN(channel) {
      console.log(ChannelFactory.update({id: channel._id}, channel));
      console.log("Updated");
    }

    function deleteChannelFN(channel) {
      // channel = new ChannelFactory(channel);
      return channel.$delete({id:channel._id});

    }


    function getChannelByIDFN(idChannel) {
      return ChannelFactory.get({id: idChannel}).$promise;
    }


    function getChannelsByUserFN(userId) {

      return ChannelFactory.getChannelsByUser({userId: userId}).$promise;
    }


  }

})();
