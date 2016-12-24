/**
 * Created by priya on 12/23/2016.
 */

var app = angular.module("groceryListApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/",{
            templateUrl: "views/groceryList.html",
            controller: "HomeController"

        })
        .when("/addItem",{
            templateUrl: "views/addItem.html",
            controller: "GroceryListItemController"
        })
        .when("/addItem/edit/:id/",{
            templateUrl: "views/addItem.html",
            controller: "GroceryListItemController"
        })
        .otherwise({
            redirectTo:"/"
        });
});

app.service("GroceryService", function () {
    var groceryService = {};

    groceryService.groceryItems = [
        {id: 1, completed: false, itemName: 'onions', date: new Date("December 1, 2016 12:00:00")},
        {id: 2, completed: false, itemName: 'chips', date: new Date("December 1, 2016 12:00:00")},
        {id: 3, completed: false, itemName: 'tomatoes', date: new Date("December 1, 2016 12:00:00")},
        {id: 4, completed: false, itemName: 'potatoes', date: new Date("December 2, 2016 12:00:00")},
        {id: 5, completed: false, itemName: 'capsicum', date: new Date("December 3, 2016 12:00:00")},
        {id: 6, completed: false, itemName: 'coriander', date: new Date("December 3, 2016 12:00:00")},
        {id: 7, completed: false, itemName: 'rice', date: new Date("December 4, 2016 12:00:00")},
        {id: 8, completed: false, itemName: 'apples', date: new Date("December 5, 2016 12:00:00")}
    ];

    groceryService.findById = function (id) {
        for(var item in groceryService.groceryItems){
            if(groceryService.groceryItems[item].id===id){
                return groceryService.groceryItems[item];
            }
        }
    }

    groceryService.getNewId = function () {
        if(groceryService.newId){
            groceryService.newId++;
            return groceryService.newId;
        }else{
            var maxId = _.max(groceryService.groceryItems, function(entry){return entry.id;});
            groceryService.newId=maxId.id+1;
            return groceryService.newId;
        }
    };

    groceryService.save = function (entry) {
        var updatedItem = groceryService.findById(entry.id);
        if(updatedItem){
            updatedItem.completed = entry.completed;
            updatedItem.itemName=entry.itemName;
            updatedItem.date=entry.date;
        }else{
            entry.id = groceryService.getNewId();
            groceryService.groceryItems.push(entry);
        }
    };

    groceryService.removeItem = function (entry) {
        var index = groceryService.groceryItems.indexOf(entry);
        groceryService.groceryItems.splice(index,1);
    };

    groceryService.markCompleted = function (entry) {
        entry.completed = !entry.completed;
    };

    return groceryService;

})

app.controller("HomeController", ["$scope", "GroceryService", function ($scope, GroceryService){
    $scope.groceryItems = GroceryService.groceryItems;

    $scope.removeItem = function(entry){
        GroceryService.removeItem(entry);
    };

    $scope.markCompleted = function (entry) {
        GroceryService.markCompleted(entry);
    };
}]);

app.controller("GroceryListItemController",["$scope", "$routeParams", "$location", "GroceryService", function ($scope, $routeParams,$location,GroceryService) {

    if(!$routeParams.id){
        $scope.groceryItem = {id:0, completed: false, itemName:"", date: new Date()};
    }else{
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
    }

    $scope.save = function(){
        GroceryService.save($scope.groceryItem);
        $location.path("/");
    }

    console.log($scope.groceryItems);
}]);

app.directive("pvGroceryItem", function () {
    return{
        restrict:"E",
        templateUrl:"views/groceryItem.html"
    }
});

