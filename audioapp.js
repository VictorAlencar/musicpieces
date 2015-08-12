var audioApp = angular.module("audioApp", ['ngAudio']);

audioApp.controller("AudioController", ['$log', '$scope', 'ngAudio', '$timeout', function($log, $scope, ngAudio, $timeout) {
  var control = this;
  $scope.sound = ngAudio.load("music/06.mp3");

  control.inicio = 0;
  control.fim = 0;
  control.texto = '';
  control.width_progress = {width: '0%'};

  control.pieces = [];

  $scope.$watch('sound.progress', function(){
    control.width_progress = {width: (($scope.sound.progress)*100)+'%'};
  });

  control.play = function () {
    $scope.sound.play();
  };

  control.pause = function () {
    $scope.sound.pause();
  };

  control.stop = function () {
    $scope.sound.stop();
  };

  control.stopAfterSeconds = function (seconds) {
    $timeout(function() {
      --seconds;
      if(seconds == -1) {
        $scope.sound.stop();
      } else {
        control.stopAfterSeconds(seconds);
      }
    }, 1000);
  };

  control.playInterval = function (inicio, fim) {
    $scope.sound.currentTime = parseInt(inicio);
    $scope.sound.play();
    control.stopAfterSeconds(parseInt(fim) - parseInt(inicio));
  };

  control.savePiece = function() {
    control.pieces.push({inicio: control.inicio, fim: control.fim, texto: control.texto});
    sweetAlert("Saved", "Look your music piece below", "success");
    control.texto = "";
    control.inicio = 0;
    control.fim = 0;
  };
}]);