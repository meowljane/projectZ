const STATE_INIT = 3000;
const STATE_READY = 3001;
const STATE_PLAYING = 3002;
const STATE_JUDGE = 3004;
const STATE_END = 3005;
const STATE_CLEAR = 3006;


let _state = STATE_INIT;
let _stateTimer = 0;
let _timer = 0;
let _start = false;
let _widget = null; // using for contents UI
let _players = App.player;
let _result = '';
let _icon= null;
let _pp=0;
let _cleartime=0;

App.onSay.add(function(player, text) {
    if ("시작" == text & _start==false)
    {
        _pp=0;
        startState(STATE_INIT);
    }
    if("종료" == text)
    {
         startState(STATE_END);
    }
    if("클리어"==text){
        
        if (_pp==0){
            _cleartime=_timer;
        }
        startState(STATE_CLEAR);
        _pp=1;
    }
});

function startState(state) {
    _state = state;
    _stateTimer = 0;

    switch(_state)
    {
        case STATE_INIT:
            _start = true;
            _timer = 20;
            _result=''
            // [ top, topleft, topright, middle, middleleft, middleright, bottom, bottomleft, bottomright, popup ]
            // param3 : width size
            _widget = App.showWidget('widget.html', 'top', 200, 300);
            _widget.sendMessage(
                {
                timer: _timer,
                }
            );
            startState(STATE_PLAYING);
            break;
        case STATE_PLAYING:
            App.showCenterLabel('타이머를 시작합니다.',0xFFFFFF, 0x000000, 115);
            _widget.sendMessage(
                {
                state: _state,
                timer: _timer,
                }
            );
            break;
        case STATE_END:
            if(_widget)
            {
                App.showCenterLabel(_result+'타이머를 종료합니다.',0xFFFFFF, 0x000000, 115);
                _widget.destroy();
                _widget = null; // must to do for using again
            }
            _start = false;
            break;
        case STATE_CLEAR:
            _widget.sendMessage(
                {
                    state:_state,
                    timer:_cleartime,
                }
            );
            break;
    }
}

App.onUpdate.Add(function(dt) {
    if(!_start)
        return;
    if(_pp){
        return;
    }
    _stateTimer += dt;
    switch(_state)
    {
        case STATE_INIT:
            break;
        case STATE_PLAYING:
            if(_stateTimer >= 1)
            {
                _stateTimer = 0;
                _timer -= 1;
            }
            if(_timer == 0)
            {
                _result='시간이 모두 사용되었습니다. ';
                startState(STATE_END);
            }
            break;
        case STATE_END:
            break;
    }
});