var snake = {
    length: undefined,
    direction: undefined,
    array: undefined,
    tail: undefined,
    color: "green",
    create: function(){
        snake.length = 5;
        snake.array = [];
        for(var i=snake.length-1; i>=0; i--){
            snake.array.push({x: i, y: 0});
        }
    }
};

var game = {
    canvas: undefined,
    context: undefined,
    canvas_color: "white",
    cell_width: undefined,
    height: undefined,
    width: undefined,
    score: undefined,
    loop: undefined,
    score_incrementor: 10,
    food: {x: undefined, y: undefined},
    hi_score: undefined
}

function get_hi_score(){
    var stored_hi_score = JSON.parse( localStorage.getItem("hi_score") );
    if( typeof(stored_hi_score) == "undefined" ){ 
        set_hi_score(0);
        game.hi_score = 0;
    }
    else{ 
        game.hi_score = stored_hi_score;
     }
}

function set_hi_score(score){
    localStorage.setItem("hi_score", JSON.stringify(score));
    game.hi_score = score;
}

function check_collision(x, y, array){
    for(var i=0; i<array.length; i++){
        if(array[i].x == x && array[i].y == y){
            return true;
        }
    }
    return false;
}

function paint_cell(x, y){
    var w = game.cell_width;
    var h = game.cell_width;
    x = game.cell_width * x;
    y = game.cell_width * y;

    game.context.fillStyle = "black";
    game.context.fillRect(x, y, w, h);
    game.context.strokeStyle = "white";
    game.context.strokeRect(x, y, w, h);
}

function create_food(){
    game.food.x = Math.round(Math.random()*(game.width-game.cell_width)/game.cell_width);
    game.food.y = Math.round(Math.random()*(game.height-game.cell_width)/game.cell_width);
}

function is_game_over(new_x, new_y){
    return new_x == -1 
        || new_x == game.width/game.cell_width
        || new_y == -1
        || new_y == game.height/game.cell_width
        || check_collision(new_x, new_y, snake.array);
}

function food_is_eaten(new_x, new_y){
    return new_x == game.food.x
        && new_y == game.food.y;
}

function initialize(){
    snake.direction = "right";
    snake.create();
    create_food();
    game.score = 0;

    if( typeof(game.loop) != "undefined" ){
        clearInterval(game.loop)
    }

    game.loop = setInterval(paint, 60);
}

function paint(){
    game.context.fillStyle = "white";
    game.context.fillRect(0, 0, game.width, game.height);
    game.context.strokeStyle = "black";
    game.context.strokeRect(0, 0, game.width, game.height);

    var new_x = snake.array[0].x;
    var new_y = snake.array[0].y;

    if(snake.direction == "right"){ new_x++; }
    else if(snake.direction == "left"){ new_x--; }
    else if(snake.direction == "up"){ new_y--; }
    else if(snake.direction == "down"){ new_y++; }

    if(is_game_over(new_x, new_y)){
        // check if score is a new hi score
        // if it is, store it
        if(game.hi_score < game.score){
            set_hi_score(game.score);
        }

        initialize();
        return;
    }

    if(food_is_eaten(new_x, new_y)){
        snake.tail = {x: new_x, y: new_y};
        snake.length++;
        game.score += game.score_incrementor;
        create_food();
    }
    else{
        snake.tail = snake.array.pop();
        snake.tail.x = new_x;
        snake.tail.y = new_y;
    }

    snake.array.unshift(snake.tail);

    for(var i=0; i< snake.length; i++){
        var cell = snake.array[i];
        paint_cell(cell.x, cell.y);
    }

    paint_cell(game.food.x, game.food.y);

    var score_text = "Score: " + game.score;
    game.context.fillText(score_text, 5, game.height-5);

    var hi_score_text = "Hi Score: " + game.hi_score;
    game.context.fillText(hi_score_text, 5, game.height-15);
}

$(document).ready(function(){
    game.canvas = $("#canvas")[0];
    game.context = game.canvas.getContext("2d");
    game.width = game.canvas.width;
    game.height = game.canvas.height;
    game.cell_width = 10;

    get_hi_score();

    initialize();

    $(document).keydown(function(e){
		var key = e.which;

    if(key == "37" && snake.direction != "right"){ snake.direction = "left"; }
    else if(key == "38" && snake.direction != "down"){ snake.direction = "up"; }
    else if(key == "39" && snake.direction != "left"){ snake.direction = "right"; }
    else if(key == "40" && snake.direction != "up"){ snake.direction = "down"; }
	});
});