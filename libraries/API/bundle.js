/*--------------------------------------------------------------*/
//  Global Declarations
/*--------------------------------------------------------------*/


var playerFlag = false,
    playersCount = 0,
    shareCounter = 1,
    currentPlayer = {},
    players = players || {},
    lastST = 0,
    dir = '',
    videoReady = null,
    x,
    isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        iPhone: function() {
            return navigator.userAgent.match(/iPhone/i);
        },
        iPad: function() {
            return navigator.userAgent.match(/iPad/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
        }
    };

/*--------------------------------------------------------------*/
//  Video embed - YouTube APIReady Functions
/*--------------------------------------------------------------*/

function onYouTubeIframeAPIReady() {
    console.log('Htz-interactive: Iframe API is Ready!!');
    $('.inter-video').each(function(){
        var tempSrc = $(this).attr('src');
        tempSrc = /[^/]*$/.exec(tempSrc)[0];
        var tempLoop = $(this).attr('vloop');
        tempLoop = /[^/]*$/.exec(tempLoop)[0];
        var tempStart = $(this).attr('startat');
        tempStart = /[^/]*$/.exec(tempStart)[0];
        var tempEnd = $(this).attr('endat');
        tempEnd = /[^/]*$/.exec(tempEnd)[0];
        var tempauto = $(this).attr('vautoplay');
        tempauto = /[^/]*$/.exec(tempauto)[0];
        var chkVars = function(autop,src,loop,start,end){
            var resObj = {
                autoplay: '0',
                loop: '0',
                playlist: '',
                start: parseInt(start),
                end: parseInt(end),

            };
            if (autop == 'true') {
                resObj.autoplay = '1'
            } else {
                resObj.autoplay = '0'
            }
            if (loop == 'true') {
                resObj.loop = '1';
                resObj.playlist = src
            } else {
                resObj.loop = '0';
                resObj.playlist = '';
            }
            return resObj;
        };
        result = chkVars(tempauto,tempSrc,tempLoop,tempStart,tempEnd);
        currentID = $(this)[0].id;
        players[currentID] = new YT.Player(currentID, {
            videoId: tempSrc,
            playerVars: {
                rel:'0',
                autoplay: result.autoplay,
                start: result.start,
                end: result.end,
                loop: result.loop,
                playlist: result.playlist,
                showinfo: '0',
                controls: '0',
                enablejsapi: '1',
                modestbranding: '1',
                playsinline: '1',
                autohide: '1',
                wmode: "opaque"
            },
            events: {
                "onReady": function(){
                    playersCount++;
                }
            }
        });
    });

    playersL = Object.keys(players).length;
    if (playersCount == playersL) {
        playerFlag = true;
    }
    if (videoReady && typeof(videoReady) == "function") {
        videoReady();
    }

}

/*--------------------------------------------------------------*/
//  QueryString
/*--------------------------------------------------------------*/

qs = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}();

/*--------------------------------------------------------------*/
// Top Bar Toggle
/*--------------------------------------------------------------*/

if (qs.hasOwnProperty("",undefined)) {
    qs = {top:true}
} else {
    if (qs.top == 'true') {
        qs = {top:true}
    } else if (qs.top == 'false') {
        qs = {top:false}
    } else {
        qs = {top:true}
    }
}

/*--------------------------------------------------------------*/
//  Main Engine
/*--------------------------------------------------------------*/

function Engine(defaults,settings,switches){

    // --- Declarations --- //

    var that = this;

    this.defaults = {
        domain: "heb",
        mainLink: "http://www.haaretz.co.il",
        loc: "",
        staticUrl: "http://" + document.domain + "/st/c/static/",
        dataUrl: "http://" + document.domain + "/st/inter/DB/projects",
        resoUrl: "http://" + document.domain + "/st/c/static/resources/"
    }
    $.extend(true,that.defaults,defaults);
    this.settings = {
        dataPath: that.defaults.dataUrl + "/" + that.defaults.loc + "/",
        dataFiles: [
        ],
        settingsPath: that.defaults.dataUrl + "/" + that.defaults.loc + "/settings.xlsx",
        breakPoints: [600, 768, 1024, 1280]
    };
    $.extend(true,that.settings,settings);
    this.switches = {
        init: {
            bar: true,
            video: true,
            maps: true,
            street: true
        }
    };
    $.extend(true,that.switches,switches);
    this.vars = {
        current: {
            domain: ""
        },
        checkClass: ".w-check",
        isMobile : {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            iPhone: function() {
                return navigator.userAgent.match(/iPhone/i);
            },
            iPad: function() {
                return navigator.userAgent.match(/iPad/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
            }
        }
    };

    // --- Defaults Functions  --- //

    this.defFunc = {
        register: {
            shareEvents: function() {
                $(document).on('click','.inter-f, .inter-t , .inter-m , .inter-w',function(e){
                    $currentF = $(e.target).parent();
                    tempId = $(e.target)[0].className;
                    header = $currentF.attr("s-header");
                    cap = $currentF.attr("s-text");
                    desc = $currentF.attr("s-desc");
                    img = $currentF.attr("s-img");
                    linkto = $currentF.attr("s-link");
                    if (linkto == undefined) {
                        linkto = that.defaults.mainLink;
                    }
                    if (tempId.indexOf("inter-f") > -1) {
                        that.defFunc.share.f(header, desc, cap, img, linkto)
                    } else if (tempId.indexOf("inter-t") > -1) {
                        that.defFunc.share.t(linkto,header)
                    } else if (tempId.indexOf("inter-m") > -1) {
                        that.defFunc.share.m(header,desc + " | " + linkto)
                    } else if (tempId.indexOf("inter-w") > -1) {
                        that.defFunc.share.w(header + " | " +linkto);
                    }
                })
            },
            clickEvents: function() {
                // --- Menu Open Click Event --- //

                $('.inter-menu_button').on('click', function () {
                    $('.menu_list').toggleClass('active');
                    $('.menu_list > li').toggleClass('active_menu');
                });

                // --- Toggle Handler Hamburger menu --- //

                (function () {
                    "use strict";
                    var toggles = document.querySelectorAll(".cmn-toggle-switch");
                    for (var i = toggles.length - 1; i >= 0; i--) {
                        var toggle = toggles[i];
                        toggleHandler(toggle);
                    }
                    function toggleHandler(toggle) {
                        toggle.addEventListener("click", function (e) {
                            e.preventDefault();
                            (this.classList.contains("active") === true) ? this.classList.remove("active") : this.classList.add("active");
                        });
                    }
                })();

                // --- Click Events for scrollease --- //

                (function () {
                    $('body').on('click','a.scrollease',function (event) {
                        var $anchor = $(this);
                        $('html, body').stop().animate({
                            scrollTop: $($anchor.attr('href')).offset().top
                        }, 500, 'easeInOutQuint');
                        event.preventDefault();
                    });
                })();
                (function () {
                    $('body').on('click','a.scrollease.off50',function (event) {
                        var $anchor = $(this);
                        $('html, body').stop().animate({
                            scrollTop: $($anchor.attr('href')).offset().top -50
                        }, 500, 'easeInOutQuint');
                        event.preventDefault();
                    });
                })();
                (function () {
                    $('body').on('click','a.scrollease.off134',function (event) {
                        var $anchor = $(this);
                        $('html, body').stop().animate({
                            scrollTop: $($anchor.attr('href')).offset().top -134
                        }, 500, 'easeInOutQuint');
                        event.preventDefault();
                    });
                })();
            }
        },
        share: {
            fu: function(header,cap,desc,pic,link) {

            },
            f: function(header,cap,desc,pic,link) {
                FB.ui(
                    {
                        method: 'feed',
                        name: header,
                        link: link,
                        picture: pic,
                        caption: cap,
                        description: desc
                    },
                    function (response) {
                        if (response && response.post_id) {
                            // posted
                        } else {
                            // no posted
                        }
                    }
                );
            },
            t: function(link,text) {
                window.open("https://twitter.com/intent/tweet?url="+link+"&text="+text, target = "_blank");
            },
            m: function(subject,body_message) {
                window.location.href = 'mailto:' + "" + '?subject=' + subject + '&body=' + body_message;
                //win = window.open(mailto_link, 'emailWindow');
            },
            w: function(header){
                window.open("whatsapp://send?text="+header)
            },
            fCount: function(url) {
                $.getJSON("http://graph.facebook.com/?id=" + url, function (data) {
                    var shares = data.shares;
                    return shares;
                })
            }
        }
    };

    // --- Common Functions --- //

    this.func = {
        check: {
            width: function(ww){
                parseInt(ww);
                if (ww < that.settings.breakPoints[0]) {
                    //console.log(that.settings.breakPoints[0]);
                    $(that.vars.checkClass)
                        .addClass('t')
                        .removeClass('s m l x')
                } else if ((ww > that.settings.breakPoints[0]) && (ww < that.settings.breakPoints[1])) {
                    //console.log(that.settings.breakPoints[1]);
                    $(that.vars.checkClass)
                        .addClass('s')
                        .removeClass('t m l x')
                } else if (((ww > that.settings.breakPoints[1]) && (ww < that.settings.breakPoints[2])) || (ww == that.settings.breakPoints[1])) {
                    //console.log(that.settings.breakPoints[2]);
                    $(that.vars.checkClass)
                        .addClass('m')
                        .removeClass('t s l x')

                } else if (((ww > that.settings.breakPoints[2]) && (ww < that.settings.breakPoints[3])) || (ww == that.settings.breakPoints[2])) {
                    //console.log(that.settings.breakPoints[3]);
                    $(that.vars.checkClass)
                        .addClass('l')
                        .removeClass('t s m x')

                } else if (ww > that.settings.breakPoints[3]) {
                    //console.log(that.settings.breakPoints[3] + '+');
                    $(that.vars.checkClass)
                        .addClass('x')
                        .removeClass('t s m l')

                }
            },
            dfp: function() {
                HTZgptAdSlots.forEach(function(adslot){googletag.pubads().refresh([adslot]);});
                TMgptAdSlots.forEach(function(adslot){googletag.pubads().refresh([adslot]);})
            }
        },
        inView: {
            vid: function(dir) {
                //console.log('inview func');
                $('.inter-video').each(function(){
                    var currentIDX = $(this).attr('id'),
                        docViewTop = $(window).scrollTop(),
                        docViewBottom = docViewTop + $(window).height(),
                        elemTop = $(this).offset().top,
                        elemBottom = elemTop + $(this).height(),
                        currentPlayer = players[currentIDX],
                        prePlay = (currentPlayer == undefined) ? undefined : $(currentPlayer.f).attr("prePlay"),
                        viewPlay  = (currentPlayer == undefined) ? undefined : $(currentPlayer.f).attr("viewPlay");
                    //console.log(currentIDX + " : " + "viewplay: "+viewPlay);
                    if (prePlay) {
                        currentPlayer.mute();
                        if (elemTop == 0) {
                            currentPlayer.playVideo();
                        }
                        if ((elemTop > docViewBottom) && (elemTop > docViewTop)) {
                            currentPlayer.pauseVideo();
                        }
                        if (((elemTop - docViewBottom) < 1000) && (elemTop > docViewTop) && (dir == 'up')) {
                            currentPlayer.playVideo();
                        }
                        if ((elemTop < docViewBottom) && (elemTop > docViewTop)) {
                            currentPlayer.playVideo();
                        }
                        if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
                            currentPlayer.playVideo();
                        }
                        if ((elemBottom < docViewTop) && (elemBottom < docViewBottom)) {
                            currentPlayer.pauseVideo();
                        }
                        if ((elemBottom > docViewTop) && (elemBottom < docViewBottom)) {
                            currentPlayer.playVideo();
                        }
                    } else if (viewPlay == 'true') {
                        if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
                            currentPlayer.playVideo();
                        } else {
                            currentPlayer.pauseVideo();
                        }
                    } else if (viewPlay == 'mute') {
                        currentPlayer.mute();
                        if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
                            currentPlayer.playVideo();
                        } else {
                            currentPlayer.pauseVideo();
                        }
                    }
                });
            }
        }
    };

    // --- Init Functions --- //

    this.init = {
        video: function() {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/player_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        },
        dfp: function() {

            ($('.inter-ad').get()).forEach(function(ad){
                googletag.cmd.push(function() {
                    googletag.display(ad.id);
                })
            });
        },
        street: function(elem,lat,lng) {
            //console.log(lat + " : " + lng);
            panorama = new google.maps.StreetViewPanorama(
                document.getElementById(elem),
                {
                    position: {lat: lat, lng: lng},
                    pov: {heading: 165, pitch: 0},
                    zoom: 1
                });
        }
    };

    // --- Build Function --- //

    this.build = {
        bar: function(){
            // --- Build the markup --- //
            $.getJSON("data/bar.json",function(data) {
                //var setDomain = data.setup.domain;
                //alert(setDomain);
                var menu_str = '',
                    menu_items_str = '',
                    bar_str = "";
                if (data.menu !== undefined) {
                    for (var i = 0; i < data.menu.length; i++) {
                        templink = data.menu[i].link;
                        if (templink.indexOf("http://") > -1) {
                            menu_items_str += '<li class="outerlink"><a href="' + templink + '">' + data.menu[i].title + '</a></li>';
                        } else {
                            menu_items_str += '<li><a class="scrollease off50" href="#' + templink + '">' + data.menu[i].title + '</a></li>';
                        }
                    }
                    menu_str = '' +
                        '<div class="menu_button">' +
                        '<button class="inter-menu_button cmn-toggle-switch cmn-toggle-switch__htx">' +
                        '<span>' + that.data.domain[that.defaults.domain].text.nav + '</span>' +
                        '</button>' +
                        '</div>' +
                        '<ul class="menu_list">' +
                        menu_items_str +
                        '</ul>';
                }

                if (data.share.header !== "") {
                    share_str = '' +
                        '<div class="inter-bar_shares" s-header="'+ data.share.header +'" s-text="'+ data.share.text +'" s-desc="'+ data.share.desc +'" s-img="'+ data.share.img +'" s-link="'+ data.share.link +'">' +
                        '<button class="inter-f" s-type="main">f</button>' +
                        '<button class="inter-t" s-type="main">t</button>' +
                        '</div>';
                }

                bar_str = '' +
                    '<div class="inter-bar w-check">' +
                    menu_str +
                    '<a href='+ that.data.domain[that.defaults.domain].home +' target="_blank">' +
                    '<span class="hid">' + that.data.domain[that.defaults.domain].text.name + '</span>' +
                    '<div class="inter-bar_logo">' +
                    '<img src="'+ that.data.domain[that.defaults.domain].logo +'" />' +
                    '</div>' +
                    '</a>' +
                    share_str +
                    '</div>';

                /*--------------------------------------------------------------*/
                //  Inject and append before main container
                /*--------------------------------------------------------------*/

                $(".inter-mc").before(bar_str);

                // --- Menu Open Click Event --- //

                $('.inter-menu_button').on('click', function () {
                    $('.menu_list').toggleClass('active');
                    $('.menu_list > li').toggleClass('active_menu');
                });

                // --- Toggle Handler Hamburger menu --- //

                (function () {
                    "use strict";
                    var toggles = document.querySelectorAll(".cmn-toggle-switch");
                    for (var i = toggles.length - 1; i >= 0; i--) {
                        var toggle = toggles[i];
                        toggleHandler(toggle);
                    }
                    function toggleHandler(toggle) {
                        toggle.addEventListener("click", function (e) {
                            e.preventDefault();
                            (this.classList.contains("active") === true) ? this.classList.remove("active") : this.classList.add("active");
                        });
                    }
                })();

                // --- Click Events for scrollease --- //

                (function () {
                    $('body').on('click','a.scrollease',function (event) {
                        console.log('click');
                        var $anchor = $(this);
                        $('html, body').stop().animate({
                            scrollTop: $($anchor.attr('href')).offset().top
                        }, 500, 'easeInOutQuint');
                        event.preventDefault();
                    });
                })();
                (function () {
                    $('body').on('click','a.scrollease.off50',function (event) {
                        var $anchor = $(this);
                        $('html, body').stop().animate({
                            scrollTop: $($anchor.attr('href')).offset().top -50
                        }, 500, 'easeInOutQuint');
                        event.preventDefault();
                    });
                })();
            });
        },
        street: function() {
            var tempArr = $('.inter-sv');
            //console.log(tempArr)
            for (var i = 0, len = tempArr.length; i < len; i++) {
                tempid = tempArr[i].id;
                templat = $(tempArr[i]).attr('data-lat');
                templng = $(tempArr[i]).attr('data-lan');
                //console.log(tempid + " : " + templat + " : " + templng)
                that.init.street(tempid,parseFloat(templat),parseFloat(templng))
            }
        }
    };

    // --- DataBase --- //

    this.data = {
        libs: {
            rsrc: "http://www.haaretz.co.il/st/c/static/resources/"
        },
        domain: {
            heblabels: {
                logo: "http://www.haaretz.co.il/st/c/static/resources/img/logos/htz-labels.png",
                home: "http://www.haaretz.co.il",
                text: {
                    name: "×”××¨×¥",
                    nav: "× ×™×•×•×˜"
                }
            },
            heb: {
                logo: "http://www.haaretz.co.il/st/c/static/resources/img/logos/Haaretz_hebrew.png",
                home: "http://www.haaretz.co.il",
                text: {
                    name: "×”××¨×¥",
                    nav: "× ×™×•×•×˜"
                }
            },
            eng: {
                logo: "http://www.haaretz.com/st/c/static/resources/img/logos/htzeng_new_logo_1.png",
                home: "http://www.haaretz.com",
                text: {
                    name: "Haaretz",
                    nav: "navigation"
                }
            },
            tm: {
                logo: "http://www.themarker.com/st/c/static/resources/img/logos/marker-logo.svg",
                home: "http://www.themarker.com",
                text: {
                    name: "×“×” ×ž×¨×§×¨",
                    nav: "× ×™×•×•×˜"
                }
            },
            tmf: {
                logo: "http://www.themarker.com/st/c/static/resources/img/logos/LogoFinance.png",
                home: "http://finance.themarker.com",
                text: {
                    name: "×“×” ×ž×¨×§×¨",
                    nav: "× ×™×•×•×˜"
                }
            },
            tmfp: {
                logo: "http://www.themarker.com/st/c/static/resources/img/logos/finance_prom.jpg",
                home: "http://finance.themarker.com",
                text: {
                    name: "×“×” ×ž×¨×§×¨",
                    nav: "× ×™×•×•×˜"
                }
            }
        }
    };
}

