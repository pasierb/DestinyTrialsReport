(function() {
  'use strict';

  angular
    .module('trialsReportApp')
    .factory('realtimeContentFactory', function () {

      var locationActivities = [
        'Camping',
        'Dancing',
        'Hardscoping',
        'Crouching',
        'Running',
        'Hiding',
        'Fleeing',
        'Eating',
        'Cursing',
        'Walking',
        'Sniping',
        'Dying',
        'Planning',
        'Googling',
        'Ducking',
        'Barking',
        'Chillin\'',
        'Thinking about life',
        'Peeing',
        'Contemplating',
        'Going mad',
        'Jumping',
        'Blinking',
        'Gliding',
        'Titan-skating',
        'DDOSing',
        'Sweating',
        'Try-harding',
        'Giving up',
        'LFGing',
        'Hacking',
        'Headglitching',
        'Teleporting',
        'Vanishing',
        'Partying',
        'Pop-locking',
        'Groovin\'',
        'Crying',
        'Bawling',
        'Pacing',
        'Smooching',
        'Plotting',
        'Scheming',
        'Cooking',
        'Showering',
        'Reviving',
        'Praying',
        'Lovin\' it',
        'Freewheeling',
        'Picking up ammo',
        'Switching weapons',
        'Watching Netflix',
        'Laughing',
        'Planning revenge',
        'Screaming',
        'Shouting',
        'Looking for the 7th chest',
        'Shrieking',
        'Flexing',
        'Training',
        'Heating up',
        'Warming up',
        'Dancing',
        'Breakdancing',
        'Moonwalking',
        'Drinking',
        'Overthinking',
        'Texting',
        'Checking Facebook',
        'Blaming lag',
        'Vetoing',
        'Barking',
        'Fishing',
        'Improvising',
        'Joking',
        'Smoking',
        'Overdosing',
        'Shotgunning',
        'Aiming',
        'Watching TV',
        'Twittering',
        'Procrastinating',
        'Studying',
        'Giving birth',
        'Catching Pokemon',
        'Drawing',
        'Painting',
        'Relaxing',
        'Fighting',
        'Complaining',
        'Streaming',
        'Chatting',
        'Going insane',
        'Getting drunk',
        'Vlogging',
        'Bird-watching',
        'Drinking coffee'
      ];

      var locationPlaces = [
        'Back Wall',
        'Inside Platform',
        'Inside Heavy',
        'A Flag',
        'B Flag',
        'C Flag',
        'A Special',
        'Pillar',
        'A Wheel',
        'C Wheel',
        'C Special',
        'Outside A',
        'Outside Platform',
        'Outside Heavy',
        'Outside C',
        'Head-glitch Rock',
        'A Bridge',
        'C Bridge',
        'Lower Hall',
        'A Stairs',
        'C Stairs'
      ];

      var thoughts = [
        'I should make pizza tonight',
        'Halo 2 is a much better game than this',
        'I miss doubleshotting :(',
        'I don\'t feel like dancing',
        'Please please please let me go flawless',
        'Lorem ipsum dolor sit amet',
        'Daaaaaaance to the music',
        'I should throw money at my screen',
        'IF I GET HEADSHOTTED ONE MORE TIME..!',
        'Destiny Trials Report sucks',
        'Destiny Trials Report is da best',
        'This is a nice rock to hide behind',
        'Can\'t wait for the Fusion Rifle meta',
        'Those Trials Report developers are sexy',
        'Has anyone really been far even as decided to use even go want to do look more like?',
        'Is this the real life?',
        'Hello? Is it me you\'re looking for?',
        'It\'s called teamwork Hotshy',
        'There\'s no I in team',
        'HELP!',
        'Uh-oh',
        'Why do I even care anymore?',
        'Leave Britney alone!',
        'I need to get out more',
        'I wanna know what love is',
        'Never gonna give you up…',
        'How much wood could Lord Shaxx chuck?',
        'Zhavala sells sea shells… by the…',
        'Anybody else kinda creeped out by Xûr?',
        'Does Ikora have a Tinder account?',
        'Oh hey, special ammo! Yep… I\'m dead…',
        'This map ain\'t bad. Could be Sector 618',
        'Another DO rank up, another lousy ghost…',
        'Another NM rank up, another lousy ghost…',
        'Another FWC rank up, another lousy ghost…',
        'IB ammo = longest 8 seconds of my life',
        'Pfffft look at this team, we got this.',
        'Let\'s just… imagine it\'s a carry…',
        'Oh great, I\'ll bet these guys stream…',
        'Oh would you look at that, redbar…',
        'If this guy lags ONE MORE TIME',
        'Mmmm McDonalds WiFi. I\'m not Lovin\' It.',
        'Hey the new NLB flinch isn\'t too ba- :(',
        'OK, not gonna fall off the map this time',
        'OK, not gonna whiff my super this time.',
        'Okay, not going to kill myself this time.',
        'Why haven\'t I followed TrialsReport on Twitter?',
        'Why is all the rum gone?',
        'I\'M TIRED OF ALL THESE AHAMKARA ON THIS',
        'Oh yep, he\'s runnin\' stickies…',
        'Triple Defender Titan? Why?!',
        'Oh hey, I know these guys!',
        'We should send ggs after the game.',
        'These guys are solid. Let\'s go.',
        'We can take \'em.',
        'Remember, it\'s not over till it\'s over',
        'I hate this map…',
        'Why isn\'t the map ever Bastion?',
        'I hope I\'m better at Destiny 2',
        'Cayde is my homeboy',
        'ROFLCOPTER',
        'I need a giant "laser"',
        'Yay! There\'s a Charizard over here!',
        'Why can\'t we be friends?',
        'Imagine all the people…',
        'THIS IS AMAZING!!!',
        'I\'m just here for my Record Book',
        'I\'m just here so I won\'t get fined',
        'This is so much better than my job',
        'I\'m sure I\'ld win in Sparrow Racing',
        'Just here for the Ghost\'s, leave me alone',
        'NERF EVERYTHING BUNGIE PLZ',
        'I can\'t stand all this violence',
        'I love it when a plan comes together',
        'In the midst of chaos, there is also opportunity',
        'On my signal, unleash hell',
        'I don\'t have time to explain',
        'Frankly my dear, I don\'t give a damn',
        'You\'re gonna need a bigger boat.',
        'May the force be with you',
        'Toto, I\'ve a feeling we\'re not in Kansas anymore',
        'I am your father',
        'Why so serious?',
        'I see dead people',
        'I need a weapon',
        'Do a barrel roll!',
        'All your base are belong to us',
        'Mess with the best, you will die like the rest',
        'I\'m here to kick ass and chew bubble-gum',
        'Die, would you kindly?',
        'Eureka!',
        'Heavy heavy heavy run run run!',
        'Are my thoughts even private?',
        'Can people see inside my head?',
        'Mega Real-Time Report is very accurate',
        'Wow, that TSRELO is very accurate',
        'In the middle of difficulty lies opportunity',
        'Noodles? More like... spaghetti',
        'I\'m a real boy!'
      ];

      var getRandomItemOf = function (array) {
        return array[Math.floor(Math.random() * array.length)]
      }

      var getNewHtml = function (type, inventory) {
        if (type === 'location') {
          return getRandomItemOf(locationActivities) + ' at ' + getRandomItemOf(locationPlaces);
        } else if (type === 'thought') {
          return '"' + getRandomItemOf(thoughts) + '"';
        } else if (type === 'elo') {
          return (Math.round(Math.random() * 1500) + 800).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else if (type === 'weapon' && inventory !== undefined) {

          var random = Math.round(Math.random() * 100),
              index = 0;

          if (random > 33 && random <= 66) {
            index = 1;
          } else if (random > 66) {
            index = 2;
          }

          return '<img class="last-match-weapon__img img-responsive" alt="' + inventory[index].definition.name +'" src="' + inventory[index].definition.icon + '">' + inventory[index].definition.name;
        }
      };

      return {
        getNewHtml: getNewHtml
      }
    })
    .directive('realtime', ['$timeout', 'realtimeContentFactory', function($timeout, realtimeContentFactory) {
      return {
        restrict: 'A',
        scope: {
          contentType: '@type',
          inventory: '='
        },
        link: function ($scope, elem) {
          $scope.update = function () {

            var oldHtml = elem.html();
            var newHtml = realtimeContentFactory.getNewHtml($scope.contentType, $scope.inventory);

            if (oldHtml !== newHtml) {
              elem.addClass('transitioning');
              $timeout(function () {
                elem.html(newHtml);
                elem.removeClass('transitioning');
              }, 200);
            }

            $timeout(function () {
              $scope.update();
            }, Math.round(Math.random() * 5000) + 5000);
          };

          $scope.update();
        }
      }
    }]);
}());
