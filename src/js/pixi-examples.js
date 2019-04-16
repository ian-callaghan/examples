"use strict";

/* Brett Meyer - Broken Pony Club */
var bpc = {};

function getParameterByName(name) {
    var match = RegExp("[?&]".concat(name, "=([^&]*)")).exec(
        window.location.search
    );
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function getMajorPixiVersion(pixiVersionString) {
    var majorVersion = 5;

    if (pixiVersionString.substr(0, 1) === "v") {
        majorVersion = parseInt(pixiVersionString.substr(1, 1), 10);
    }

    return majorVersion;
}

jQuery(document).ready(function($) {
    window.onpopstate = function onpopstate(event) {
        bpc.pixiVersionString = getParameterByName("v") || "dev";
        bpc.generateIFrameContent();
        $(".select-group .select li.selected").removeClass("selected");
        var $selected = $(
            '.select-group .select li[data-val="'.concat(
                bpc.pixiVersionString,
                '"]'
            )
        );
        $selected.addClass("selected");
        $(".select-group .select .current").text($selected.text());
        $(".main-content").animate(
            {
                scrollTop: 0
            },
            200
        );
    };

    bpc.allowedVersions = [5];
    bpc.pixiVersionString = getParameterByName("v") || "dev";
    bpc.majorPixiVersion = getMajorPixiVersion(bpc.pixiVersionString);
    bpc.exampleUrl = "";
    bpc.exampleFilename = "";
    bpc.exampleTitle = "";
    bpc.exampleSourceCode = "";
    bpc.exampleRequiredPlugins = [];
    bpc.exampleValidVersions = [];
    bpc.editorOptions = {
        mode: "javascript",
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        viewportMargin: Infinity,
        lineWrapping: true
    };
    bpc.clickType = "click";
    bpc.animTime = 0.15;

    bpc.resize = function resize() {}; // async script loading

    bpc.scriptsToLoad = [
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js"
    ];
    bpc.scriptsLoaded = 0;

    bpc.loadScriptsAsync = function loadScriptsAsync() {
        for (var i = 0; i < bpc.scriptsToLoad.length; i++) {
            $.ajax({
                url: bpc.scriptsToLoad[i],
                dataType: "script",
                cache: true,
                async: true,
                success: bpc.fileLoaded
            });
        }

        if (bpc.scriptsToLoad.length === 0) {
            bpc.loadComplete();
        }
    };

    bpc.fileLoaded = function fileLoaded() {
        bpc.scriptsLoaded++;

        if (bpc.scriptsLoaded === bpc.scriptsToLoad.length) {
            bpc.loadComplete();
        }
    };

    bpc.loadComplete = function loadComplete() {
        $.getJSON("examples/manifest.json", function(data) {
            var sections = Object.keys(data);

            for (var i = 0; i < sections.length; i++) {
                var html = '<span class="section" data-section="'
                    .concat(sections[i], '">')
                    .concat(sections[i], '</span><ul data-section="')
                    .concat(sections[i], '">');
                var items = data[sections[i]];

                for (var j = 0; j < items.length; j++) {
                    var plugins =
                        typeof items[j].plugins !== "undefined"
                            ? items[j].plugins.join(",")
                            : "";
                    var validVersions =
                        typeof items[j].validVersions !== "undefined"
                            ? items[j].validVersions.join(",")
                            : "";
                    html += '<li data-src="'
                        .concat(items[j].entry, '" data-plugins="')
                        .concat(plugins, '" data-validVersions="')
                        .concat(validVersions, '">')
                        .concat(items[j].title, "</li>");
                }

                html += "</ul>";
                $(".main-menu").append(html);
            }

            bpc.initNav();
        });
        $.getJSON(
            "https://api.github.com/repos/pixijs/pixi.js/git/refs/tags",
            function(dataTag) {
                // Filters the tags to only include versions we care about.
                // Only use the last 5 tags per major version
                var maxTagsPerVersion = 5;
                var taggedVersions = [];
                bpc.allowedVersions.forEach(function(version) {
                    var filtered = dataTag.filter(function(tag) {
                        return (
                            tag.ref.indexOf("refs/tags/v".concat(version)) === 0
                        );
                    });

                    if (filtered.length > maxTagsPerVersion) {
                        filtered = filtered.slice(-maxTagsPerVersion);
                    }

                    taggedVersions = taggedVersions.concat(filtered);
                });
                taggedVersions = taggedVersions.map(function(tag) {
                    return tag.ref.replace("refs/tags/", "");
                });

                for (var i = 0; i < taggedVersions.length; i++) {
                    $(".select-group .select ul").append(
                        '<li data-val="'
                            .concat(taggedVersions[i], '">')
                            .concat(taggedVersions[i], "</li>")
                    );
                }

                $.getJSON(
                    "https://api.github.com/repos/pixijs/pixi.js/git/refs/heads",
                    function(dataHead) {
                        // For NEXT version development
                        dataHead = dataHead
                            .filter(function(tag) {
                                return tag.ref.indexOf("refs/heads/next") === 0;
                            })
                            .map(function(tag) {
                                return tag.ref.replace("refs/heads/", "");
                            });

                        for (var _i = 0; _i < dataHead.length; _i++) {
                            $(".select-group .select ul").append(
                                '<li data-val="'
                                    .concat(dataHead[_i], '">')
                                    .concat(dataHead[_i], "</li>")
                            );
                        }

                        var $selected = $(
                            '.select-group .select li[data-val="'.concat(
                                bpc.pixiVersionString,
                                '"]'
                            )
                        );
                        $selected.addClass("selected");
                        $(".select-group .select .current").text(
                            $selected.text()
                        );
                    }
                );
            }
        );
        var stats = new Stats();
        console.log(stats, stats.domElement);
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        stats.domElement.style.position = "absolute";
        stats.domElement.style.right = "0px";
        stats.domElement.style.zIndex = 999;
        document.body.appendChild(stats.domElement);

        function animate() {
            stats.begin();

            // monitored code goes here

            stats.end();

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    };

    bpc.initNav = function initNav() {
        $(".main-menu .section").on(bpc.clickType, function onClick() {
            $(this)
                .next("ul")
                .slideToggle(250);
            $(this).toggleClass("open");
        });
        $(".main-menu li").on(bpc.clickType, function onClick() {
            if (!$(this).hasClass("selected")) {
                $(".main-menu li.selected").removeClass("selected");
                $(this).addClass("selected"); // load data

                bpc.closeMobileNav();
                var page = "/"
                    .concat(
                        $(this)
                            .parent()
                            .attr("data-section"),
                        "/"
                    )
                    .concat($(this).attr("data-src"));
                bpc.exampleTitle = $(this).text();
                window.location.hash = page;
                document.title = "".concat(
                    bpc.exampleTitle,
                    " - PixiJS Examples"
                ); // Track page change in analytics

                ga("set", {
                    page: page,
                    title: bpc.exampleTitle
                });
                ga("send", "pageview");
                bpc.exampleUrl = "examples/js/"
                    .concat(
                        $(this)
                            .parent()
                            .attr("data-section"),
                        "/"
                    )
                    .concat($(this).attr("data-src"));
                bpc.exampleFilename = $(this).attr("data-src");
                var plugins = $(this).attr("data-plugins");
                bpc.exampleRequiredPlugins =
                    plugins === "" ? [] : plugins.split(",");
                var validVersions = $(this).attr("data-validVersions");
                bpc.exampleValidVersions =
                    validVersions === ""
                        ? [4, 5]
                        : validVersions.split(",").map(function(v) {
                              return parseInt(v, 10);
                          });
                $.ajax({
                    url: "examples/js/"
                        .concat(
                            $(this)
                                .parent()
                                .attr("data-section"),
                            "/"
                        )
                        .concat($(this).attr("data-src")),
                    dataType: "text",
                    success: function success(data) {
                        bpc.exampleSourceCode = data;
                        bpc.generateIFrameContent();
                    }
                });
            }
        });

        bpc.generateIFrameContent = function generateIFrameContent() {
            // Remove all iFrames and content
            var iframes = document.querySelectorAll("iframe");

            for (var i = 0; i < iframes.length; i++) {
                iframes[i].parentNode.removeChild(iframes[i]);
            }

            $("#example").html(
                '<iframe id="preview" src="blank.html"></iframe>'
            );
            $(".CodeMirror").remove();
            $(".main-content #code").html(bpc.exampleSourceCode); // Generate HTML and insert into iFrame

            var pixiUrl = "";

            if (bpc.pixiVersionString === "local") {
                pixiUrl = "dist/pixi.js";
            } else if (bpc.majorPixiVersion === 3) {
                // pull v3 from github cdn
                pixiUrl = "https://cdn.rawgit.com/GoodBoyDigital/pixi.js/".concat(
                    bpc.pixiVersionString,
                    "/bin/pixi.js"
                );
            } else {
                // other versions come from S3
                pixiUrl = "https://d157l7jdn8e5sf.cloudfront.net/".concat(
                    bpc.pixiVersionString,
                    "/pixi-legacy.js"
                );
            }

            var html = "<!DOCTYPE html><html><head><style>";
            html +=
                "body,html{margin:0px;height:100%;overflow:hidden;}canvas{width:100%;height:100%;}";
            html += "</style></head><body>";
            html +=
                '<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>';
            html += '<script src="'.concat(pixiUrl, '"></script>');

            if (bpc.majorPixiVersion < 5) {
                html += '<script src="pixi-plugins/pixi-legacy.js"></script>';
            }

            for (var _i2 = 0; _i2 < bpc.exampleRequiredPlugins.length; _i2++) {
                html += '<script src="pixi-plugins/'.concat(
                    bpc.exampleRequiredPlugins[_i2],
                    '.js"></script>'
                );
            }

            bpc.editor = CodeMirror.fromTextArea(
                document.getElementById("code"),
                bpc.editorOptions
            );

            if (bpc.exampleRequiredPlugins.length) {
                $("#code-header").text(
                    "Example Code (plugins used: ".concat(
                        bpc.exampleRequiredPlugins.toString(),
                        ")"
                    )
                );
            } else {
                $("#code-header").text("Example Code");
            }

            if (
                !bpc.exampleValidVersions.length ||
                bpc.exampleValidVersions.indexOf(bpc.majorPixiVersion) > -1
            ) {
                $("#example-title").html(bpc.exampleTitle);
                html += "<script>window.onload = function(){".concat(
                    bpc.exampleSourceCode,
                    "}</script></body></html>"
                );
                $(".example-frame").show();
            } else {
                $("#example-title").html(
                    "".concat(
                        bpc.exampleTitle,
                        "<br><br><br><br><br><br><br>"
                    ) +
                        "The selected version of PixiJS does not work with this example." +
                        "<br><br>" +
                        "Selected version: v".concat(
                            bpc.majorPixiVersion,
                            "<br><br>"
                        ) +
                        "Required version: v".concat(
                            bpc.exampleValidVersions.toString(),
                            "<br><br><br><br><br>"
                        )
                );
                $(".example-frame").hide();
            }

            var iframe = document.getElementById("preview");
            var frameDoc =
                iframe.contentDocument || iframe.contentWindow.document;
            frameDoc.open();
            frameDoc.write(html);
            frameDoc.close();
        };

        bpc.openMobileNav = function openMobileNav() {
            TweenMax.to("#line1", bpc.animTime, {
                y: 0,
                ease: Linear.easeNone
            });
            TweenMax.to("#line2", 0, {
                alpha: 0,
                ease: Linear.easeNone,
                delay: bpc.animTime
            });
            TweenMax.to("#line3", bpc.animTime, {
                y: 0,
                ease: Linear.easeNone
            });
            TweenMax.to("#line1", bpc.animTime, {
                rotation: 45,
                ease: Quart.easeOut,
                delay: bpc.animTime
            });
            TweenMax.to("#line3", bpc.animTime, {
                rotation: -45,
                ease: Quart.easeOut,
                delay: bpc.animTime
            });
            $(".main-nav").addClass("mobile-open");
        };

        bpc.closeMobileNav = function closeMobileNav() {
            TweenMax.to("#line1", bpc.animTime, {
                rotation: 0,
                ease: Linear.easeNone,
                delay: 0
            });
            TweenMax.to("#line3", bpc.animTime, {
                rotation: 0,
                ease: Linear.easeNone,
                delay: 0
            });
            TweenMax.to("#line2", 0, {
                alpha: 1,
                ease: Quart.easeOut,
                delay: bpc.animTime
            });
            TweenMax.to("#line1", bpc.animTime, {
                y: -8,
                ease: Quart.easeOut,
                delay: bpc.animTime
            });
            TweenMax.to("#line3", bpc.animTime, {
                y: 8,
                ease: Quart.easeOut,
                delay: bpc.animTime
            });
            $(".main-nav").removeClass("mobile-open");
        };

        bpc.updateMenu = function updateMenu() {
            $(".main-nav .main-menu ul li").each(function updateEachMenuItem() {
                var validVersions = $(this).attr("data-validVersions");
                var exampleValidVersions =
                    validVersions === ""
                        ? [4, 5]
                        : validVersions.split(",").map(function(v) {
                              return parseInt(v, 10);
                          });

                if (exampleValidVersions.indexOf(bpc.majorPixiVersion) === -1) {
                    $(this).addClass("invalid");
                } else {
                    $(this).removeClass("invalid");
                }
            });
        };

        bpc.updateMenu();
        $(".main-header .hamburger").on(bpc.clickType, function(e) {
            e.preventDefault();

            if ($(".main-nav").hasClass("mobile-open")) {
                bpc.closeMobileNav();
            } else {
                bpc.openMobileNav();
            }

            return false;
        }); // Deep link

        if (window.location.hash !== "") {
            var hash = window.location.hash.replace("#/", "");
            var arr = hash.split("/");

            if (arr.length > 1) {
                if (
                    $('.main-menu .section[data-section="'.concat(arr[0], '"]'))
                        .length > 0
                ) {
                    $(
                        '.main-menu .section[data-section="'.concat(
                            arr[0],
                            '"]'
                        )
                    ).trigger(bpc.clickType);

                    if (
                        $(
                            '.main-menu .section[data-section="'.concat(
                                arr[0],
                                '"]'
                            )
                        )
                            .next()
                            .find('li[data-src="'.concat(arr[1], '"]')).length >
                        0
                    ) {
                        $(
                            '.main-menu .section[data-section="'.concat(
                                arr[0],
                                '"]'
                            )
                        )
                            .next()
                            .find('li[data-src="'.concat(arr[1], '"]'))
                            .trigger(bpc.clickType);
                    }
                }
            }
        } else {
            $(".main-menu .section")
                .eq(0)
                .trigger(bpc.clickType);
            $(".main-menu li")
                .eq(0)
                .trigger(bpc.clickType);
        } // Version control

        $(".select-group").on(bpc.clickType, function onClick() {
            if (
                $(this)
                    .find(".select")
                    .hasClass("open")
            ) {
                $(this)
                    .find(".select")
                    .removeClass("open");
                $(this)
                    .find("ul")
                    .slideUp(150);
            } else {
                $(this)
                    .find(".select")
                    .addClass("open");
                $(this)
                    .find("ul")
                    .slideDown(150);
            }
        });
        $(".select-group .select").on(bpc.clickType, "li", function onClick() {
            if (!$(this).hasClass("selected")) {
                $(".select-group .select li.selected").removeClass("selected");
                $(this).addClass("selected");
                $(".select-group .select .current").text($(this).text());
                bpc.pixiVersionString = $(this).attr("data-val");
                bpc.majorPixiVersion = getMajorPixiVersion(
                    bpc.pixiVersionString
                );
                window.history.pushState(
                    bpc.pixiVersionString,
                    null,
                    "?v="
                        .concat(bpc.pixiVersionString)
                        .concat(window.location.hash)
                );
                bpc.updateMenu();
                bpc.generateIFrameContent();
                $(".main-content").animate(
                    {
                        scrollTop: 0
                    },
                    200
                );
            }
        }); // Download

        $(".footer .download").on(bpc.clickType, function() {
            bpc.SaveToDisk(bpc.exampleUrl, bpc.exampleFilename);
        }); // Refresh Button
        var num = 0;
        var itemList = [];
        $.getJSON("examples/manifest.json", function(data) {
            var sections = Object.keys(data);
            console.log(sections);
            var count = 0;
            for (var i = 0; i < sections.length; i++) {
                var items = data[sections[i]];

                for (var j = 0; j < items.length; j++) {
                    items[j].entry = sections[i] + "/" + items[j].entry;
                    itemList.push(items[j]);
                    if (window.location.href.indexOf(items[j].entry) !== -1) {
                        num = count;
                    }
                    count++;
                }
            }
        });
        $(".reload").on(bpc.clickType, function() {
            num++;
            window.location.href = "/#/" + itemList[num].entry;
            //location.reload();
            //$("#example-title").html(itemList[num].title);
            bpc.exampleTitle = itemList[num].title;
            $.ajax({
                url: "examples/js/".concat(itemList[num].entry),
                dataType: "text",
                success: function success(data) {
                    bpc.exampleSourceCode = data;
                    bpc.generateIFrameContent();
                }
            });
        });
    };

    bpc.SaveToDisk = function SaveToDisk(fileURL, fileName) {
        if (!window.ActiveXObject) {
            // for non-IE
            var save = document.createElement("a");
            save.href = fileURL;
            save.target = "_blank";
            save.download = fileName || "unknown";
            var evt = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: false
            });
            save.dispatchEvent(evt);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        } else if (!!window.ActiveXObject && document.execCommand) {
            // for IE < 11
            var newWindow = window.open(fileURL, "_blank");
            newWindow.document.close();
            newWindow.document.execCommand("SaveAs", true, fileName || fileURL);
            newWindow.close();
        }
    };

    bpc.init = function init() {
        $(window).resize(bpc.resize);
        bpc.loadScriptsAsync();
    };

    bpc.init();
});
