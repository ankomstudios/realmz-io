(( () => {
    // ---------------------------------------------------------------
    // Asset loading layer (images, sounds, shared JSON, map files).
    // GAME_ASSET_BASE is ONLY for static assets. It is deliberately separate
    // from getAPIurl()/WebSocket selection, which are untouched.
    // To switch to a local asset folder later, set it to '' (same origin as the
    // page) or e.g. 'http://127.0.0.1:5500'. To add a new asset, just reference
    // its './images/...', './sounds/...', '/shared/...' or '/map/...' path;
    // gameAsset() resolves it automatically.
    // ---------------------------------------------------------------
    const GAME_ASSET_BASE = 'https://realmz.io';
    function gameAsset(path) {
        path = String(path);
        if (/^(https?:|data:|blob:)/i.test(path))
            return path;
        const base = (GAME_ASSET_BASE || window.location.origin).replace(/\/+$/, '') + '/';
        return new URL(path.replace(/^\.\//, '').replace(/^\/+/, ''), base).href;
    }
    function gameAssetIsCrossOrigin(url) {
        try {
            return new URL(url, window.location.href).origin !== window.location.origin;
        } catch (e) {
            return false;
        }
    }
    function gameAssetImageError(url) {
        return () => console.error('[assets] image failed to load: ' + url);
    }
    async function gameAssetFetch(path, kind, options) {
        const url = gameAsset(path);
        let res;
        try {
            res = await fetch(url, options);
        } catch (e) {
            // fetch() rejects for network errors AND CORS blocks (browser hides which)
            throw new Error('[assets] request failed for ' + url + ' (network error or blocked by CORS): ' + e.message);
        }
        if (!res.ok)
            throw new Error('[assets] HTTP ' + res.status + ' for ' + url + ' (content-type: ' + res.headers.get('content-type') + ')');
        const type = res.headers.get('content-type') || '';
        if (kind === 'json') {
            if (/text\/html/i.test(type))
                throw new Error('[assets] got HTML instead of JSON for ' + url + ' (likely an error/fallback page)');
            try {
                return await res.json();
            } catch (e) {
                throw new Error('[assets] invalid JSON from ' + url + ' (content-type: ' + type + '): ' + e.message);
            }
        }
        return await res.text();
    }
    function gameAssetJSON(path) {
        return gameAssetFetch(path, 'json', {
            'headers': {
                'Accept': 'application/json'
            }
        });
    }
    function gameAssetText(path) {
        return gameAssetFetch(path, 'text', {});
    }
    var G = Object.freeze({
        'Swordsman': 0,
        'Lancer': 1,
        'Dragoon': 2,
        'Spear': 3,
        'Spork': 4,
        'Puncher': 5,
        'Sabre': 6,
        'Katana': 7,
        'Excalibur': 8,
        'Death Sabre': 9,
        'Scythe': 10,
        'Shield': 11,
        'Mirror': 12,
        'Umbrellar': 13,
        'Paladin': 14,
        'Champion': 15,
        'Holy Hammer': 16,
        'Slasher': 17,
        'Giant': 18,
        'Behemoth': 19,
        'Archer': 20,
        'Marksman': 21,
        'Crossbower': 22,
        'Winged Bow': 23,
        'Grenadier': 24,
        'Bomber': 25,
        'Rocketeer': 26,
        'Blunderbuss': 27,
        'Cannon': 28,
        'Cake Cannon': 29,
        'Gunner': 30,
        'Sniper': 31,
        'Railgun': 32,
        'Shotgun': 33,
        'Boomstick': 34,
        'Pistol': 35,
        'Gatling Gun': 36,
        'Magician': 37,
        'Charge Blaster': 38,
        'Star Blaster': 39,
        'Pulse Gun': 40,
        'Alchemist': 41,
        'Sorcerer': 42,
        'Fire Caster': 43,
        'Infernal Mage': 44,
        'Solar Flare': 45,
        'Frost Staff': 46,
        'Blizzard Staff': 47,
        'Aura Shield': 48,
        'Aura Monk': 49,
        'Rune Wizard': 50,
        'Cyber Blaster': 51,
        'Pulse Bow': 52,
        'Spitter': 53,
        'Fume Breather': 54,
        'Shurikenier': 55,
        'Berserker': 56,
        'Boomeranger': 57,
        'Jouster': 58,
        'Flamethrower': 59,
        'Knife Thrower': 60,
        'Assassin': 61,
        'Fang': 62,
        'Storm Rider': 66,
        'Chrome Orb': 70,
        'Slap Hand': 71,
        'Sharpshooter': 72,
        'Dynamiter': 73,
        'Clipper': 74,
        'Spanomancer': 75,
        'Cake Blaster': 76,
        'Meteor Staff': 77,
        'Flower Mage': 79,
        'Zen Monk': 80,
        'Orb Sage': 81,
        'Plasma Dagger': 82,
        'Plasma Spear': 83,
        'Whirlpooler': 84,
        'Reflector': 85,
        'Aura Master': 86,
        'Executor': 87
    });
    if (typeof module !== 'undefined')
        module.exports = G;
    function i(Kx) {
        return document.getElementById(Kx);
    }
    const N = {
        'active': null,
        'windows': {},
        'create': (Kx, Ky, KK) => {
            if (Kx in N.windows)
                return;
            let KO = document.createElement('window-box');
            KO.setAttribute('id', Kx);
            KO.setAttribute('title', Ky);
            KO.innerHTML = KK;
            document.body.insertBefore(KO, i('container'));
            N.windows[Kx] = KO;
            return KO;
        }
        ,
        'delete': Kx => {
            N.windows[Kx]?.remove();
            delete N.windows[Kx];
        }
    };
    window.getAPIurl = function(Kx=![]) {
        let Ky = new URL(window.location.href);
        let KK = Ky.protocol + '//' + Ky.hostname;
        let KO = Ky.hostname.split('.');
        if (KO[KO.length - 1] == 'io' && KO[KO.length - 2] == 'realmz') {
            if (Kx) {
                KK = Ky.protocol + '//realmz.io';
            } else {
                KK = Ky.protocol + '//api.realmz.io';
            }
        }
        if (KO[KO.length - 1] == 'top' && KO[KO.length - 2] == 'realmz') {
            if (Kx) {
                KK = Ky.protocol + '//realmz.top';
            } else {
                KK = Ky.protocol + '//api.realmz.top';
            }
        }
        const isRealmzHost = (KO[KO.length - 2] == 'realmz' && (KO[KO.length - 1] == 'io' || KO[KO.length - 1] == 'top'));
        const isLocalHost = (Ky.hostname == 'localhost' || Ky.hostname == '127.0.0.1' || Ky.hostname == '[::1]');
        if (!isRealmzHost && !isLocalHost) {
            // External static host (github.io, pages.dev, custom domain...):
            // API lives on Realmz's API host, not on the static site.
            if (Kx) {
                KK = 'https://realmz.io';
            } else {
                KK = 'https://api.realmz.io';
            }
        }
        if (Ky.hostname == 'iogame4.pages.dev') {
            if (Kx) {
                KK = Ky.protocol + '//realmz.io';
            } else {
                KK = Ky.protocol + '//api.realmz.io';
            }
        }
        if (Ky.hostname == 'localhost' || Ky.hostname == '127.0.0.1' || Ky.hostname == '[::1]') {
            // The local static server serves the frontend only. Route API requests
            // to Realmz's API host rather than requesting /api/... from Live Server.
            KK = 'https://api.realmz.io';
        }
        return KK;
    }
    ;
    let x = {
        's': {
            'color': 'u_blue',
            'desc': 'Move faster'
        },
        'hp': {
            'color': 'u_red',
            'desc': '+5% max health'
        },
        'regen': {
            'color': 'u_pink',
            'desc': 'Regenerate health faster'
        },
        'dash': {
            'color': 'u_orange',
            'desc': 'Dash farther'
        },
        'jump': {
            'color': 'u_yellow',
            'desc': 'Jump higher'
        },
        'wisdom': {
            'color': 'u_purple',
            'desc': 'Gain more xp from mobs'
        },
        'mobresistance': {
            'color': 'u_greenish',
            'desc': 'Gain resistance to mob damage'
        },
        'mobdmg': {
            'color': 'u_darkorange',
            'desc': 'Do more damage to mobs'
        },
        'chaindash': {
            'color': 'u_orange',
            'desc': 'Dash more frequently'
        },
        'big': {
            'color': 'u_gray',
            'desc': 'Become larger and gain more health'
        },
        'small': {
            'color': 'u_gray',
            'desc': 'Become smaller, be faster, but lose health'
        },
        'airplat': {
            'color': 'u_yellow',
            'desc': 'Extra jumps are stronger'
        },
        'ninjamode': {
            'color': 'u_crimson',
            'desc': 'Move faster when stealthed'
        },
        'extrajump': {
            'color': 'u_yellow',
            'desc': 'More jumps'
        },
        'mobblock': {
            'color': 'u_greenish',
            'desc': 'Block mob knockback'
        },
        'unstop': {
            'color': 'u_metal',
            'desc': 'Take no knockback'
        },
        'rocketjump': {
            'color': 'u_yellow',
            'desc': 'Stay still for 1 second to be able to jump higher'
        },
        'rocketdash': {
            'color': 'u_orange',
            'desc': 'Stay still for 1 second and dash for a long dash'
        },
        'shadowdodge': {
            'color': 'u_red',
            'desc': 'description'
        },
        'lava': {
            'color': 'u_red',
            'desc': 'Reduced damage from lava'
        },
        'swim': {
            'color': 'u_surf',
            'desc': 'Move at full speed in water'
        },
        'hydration': {
            'color': 'u_seafoam',
            'desc': 'Regenerate health much faster while in water'
        },
        'tidal': {
            'color': 'u_deepsea',
            'desc': 'Jump much higher while in water'
        },
        'brute': {
            'color': 'u_gold',
            'desc': 'Gain 2x more health but move 2x slower'
        },
        'feather': {
            'color': 'u_gold',
            'desc': 'Move 50% faster but lose half your health'
        },
        'wings': {
            'color': 'u_gold',
            'desc': 'Gain 2 extra jumps but fall slower'
        },
        'heavy': {
            'color': 'u_gold',
            'desc': 'Fall faster but move slower'
        },
        'armor': {
            'color': 'u_redorange',
            'desc': 'Gain damage reduction but move a bit slower'
        },
        'pullback': {
            'color': 'u_neon',
            'desc': 'Hitting enemies pulls them towards you instead of knocking them back'
        },
        'longdash': {
            'color': 'u_orange',
            'desc': 'Dash lasts 2x longer but the cooldown is 2x longer'
        },
        'none': {
            'color': 'u_red',
            'desc': 'Skip upgrades - Jack of all trades'
        },
        'pressure': {
            'color': 'u_deepsea',
            'desc': 'More resistance to the abyss'
        },
        'teleport_dash': {
            'color': 'u_void',
            'desc': 'Teleporting Dash'
        }
    };
    let y = ['s', 'jump', 'dash'];
    let K = ['wisdom', 'mobdmg', 'mobresistance'];
    let O = ['armor', 'regen', 'hp'];
    let u = [...y, ...K];
    const W = {
        2: y,
        5: O,
        8: y,
        11: ['extrajump'],
        14: ['wisdom', 'mobdmg'],
        17: y,
        20: K,
        24: ['extrajump', 'small', 'big', 'swim'],
        27: y,
        30: O,
        32: K,
        34: ['rocketdash', 'rocketjump'],
        37: y,
        39: ['chaindash', 'mobblock', 'hydration'],
        42: K,
        45: O,
        49: ['extrajump', 'unstop', 'tidal', 'pullback'],
        52: ['ninjamode', 'longdash', 'pressure', 'teleport_dash'],
        55: u,
        58: u,
        61: O,
        64: ['airplat'],
        67: u,
        71: u,
        75: O,
        79: u,
        83: u,
        87: u,
        91: O,
        95: u,
        99: u,
        100: ['brute', 'feather', 'wings', 'heavy', 'none']
    };
    const B = {
        2: ['s', 'jump', 'dash'],
        5: ['s', 'jump', 'dash', 'regen'],
        8: ['s', 'jump', 'dash', 'wisdom'],
        11: ['extrajump'],
        14: ['s', 'jump', 'dash', 'mobdmg', 'armor'],
        17: ['s', 'jump', 'dash'],
        20: ['s', 'jump', 'dash', 'regen'],
        24: ['extrajump', 'rocketjump', 'small', 'big', 'swim'],
        27: ['s', 'jump', 'dash'],
        30: ['s', 'jump', 'dash', 'wisdom', 'regen'],
        32: ['wisdom', 'mobdmg', 'regen'],
        34: ['s', 'jump', 'dash', 'rocketdash', 'regen', 'armor'],
        37: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        39: ['chaindash', 'mobblock', 'hydration'],
        42: ['s', 'jump', 'dash', 'wisdom', 'regen', 'extrajump'],
        45: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        49: ['jump', 'dash', 'unstop', 'wisdom', 'armor', 'tidal'],
        52: ['ninjamode', 'pullback', 'longdash', 'mobdmg', 'wisdom', 'pressure'],
        55: ['s', 'jump', 'dash', 'regen', 'mobdmg', 'wisdom'],
        58: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        61: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        64: ['airplat', 'wisdom', 'mobdmg'],
        67: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        71: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        75: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        79: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        83: ['s', 'jump', 'dash', 'wisdom', 'mobdmg', 'armor'],
        87: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        91: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        95: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        99: ['s', 'jump', 'dash', 'wisdom', 'mobdmg'],
        100: ['brute', 'feather', 'wings', 'heavy', 'none']
    };
    const l = {
        's': ['Basic Speed I', 'Basic Speed II', 'Basic Speed III', 'Medium Speed I', 'Medium Speed II', 'Advanced Speed'],
        'jump': ['Basic Jump I', 'Basic Jump II', 'Basic Jump III', 'Medium Jump I', 'Medium Jump II', 'Advanced Jump'],
        'dash': ['Basic Dash I', 'Basic Dash II', 'Basic Dash III', 'Medium Dash I', 'Medium Dash II', 'Advanced Dash'],
        'hp': ['Extra Health I', 'Extra Health II', 'Extra Health III'],
        'wisdom': ['Wisdom I', 'Wisdom II', 'Wisdom III'],
        'mobdmg': ['Monster Slayer I', 'Monster Slayer II', 'Monster Slayer III', 'Monster Slayer IV'],
        'chaindash': ['Chain Dash'],
        'extrajump': ['Extra Jump I', 'Extra Jump II', 'Extra Jump III'],
        'regen': ['Regen I', 'Regen II', 'Regen III'],
        'airplat': ['Air Platform'],
        'ninjamode': ['Ninja Mode'],
        'mobblock': ['Mob Blocker'],
        'unstop': ['Unstoppable'],
        'rocketjump': ['Rocket Jump'],
        'rocketdash': ['Rocket Dash'],
        'shadowdodge': ['Shadow Dodge'],
        'big': ['Big'],
        'small': ['Small'],
        'heavy': ['Heavy'],
        'lava': ['Lava Gear'],
        'brute': ['Brute'],
        'feather': ['Feather'],
        'wings': ['Wings'],
        'none': ['None'],
        'swim': ['Fins'],
        'hydration': ['Hydration'],
        'tidal': ['Tidal Jump'],
        'armor': ['Basic Armor', 'Medium Armor', 'Advanced Armor'],
        'pullback': ['Pullback'],
        'longdash': ['Long Dash'],
        'healthcharm': ['Health Charm'],
        'sticker': ['Sticker'],
        'pressure': ['Pressure Armor'],
        'mobresistance': ['Mob Resistance'],
        'teleport_dash': ['Quantum Boots']
    };
    const s = 'settings.autoUpgrade';
    const Z = 'settings.autoUpgradeHash';
    const p = 'AU1.';
    const h = Object.keys(W).sort( (Kx, Ky) => Number(Kx) - Number(Ky));
    function g(Kx, Ky) {
        let KK = l[Kx]?.length ?? 1;
        return (Ky[Kx] ?? 0) < KK && (Kx !== 'unstop' || (Ky.mobblock ?? 0) > 0);
    }
    function r(Kx) {
        let Ky = {};
        for (let KK of h) {
            let KO = W[KK].filter(Ku => g(Ku, Ky));
            if (!KO.includes(Kx[KK]))
                Kx[KK] = KO[0];
            if (Kx[KK] != null)
                Ky[Kx[KK]] = (Ky[Kx[KK]] ?? 0) + 1;
        }
        return Kx;
    }
    function D() {
        return r({});
    }
    function Q(Kx) {
        let Ky = h.map(KO => Kx[KO]);
        let KK = btoa(JSON.stringify(Ky)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return p + KK;
    }
    function M(Kx) {
        if (typeof Kx !== 'string' || !Kx.startsWith(p)) {
            throw new Error('Invalid auto upgrade hash prefix');
        }
        let Ky = Kx.substring(p.length).replace(/-/g, '+').replace(/_/g, '/');
        Ky += '='.repeat((4 - Ky.length % 4) % 4);
        let KK = JSON.parse(atob(Ky));
        if (!Array.isArray(KK) || KK.length !== h.length) {
            throw new Error('Invalid auto upgrade route length');
        }
        let KO = {};
        for (let Ku = 0; Ku < h.length; Ku++) {
            let KW = h[Ku];
            let KB = KK[Ku];
            if (!W[KW].includes(KB)) {
                throw new Error('Invalid upgrade for level ' + (Number(KW) + 1));
            }
            KO[KW] = KB;
        }
        return KO;
    }
    function Y() {
        r(Nq.autoUpgrades);
        let Kx = Q(Nq.autoUpgrades);
        Nq.autoUpgradeHash = Kx;
        localStorage.setItem(Z, Kx);
        return Kx;
    }
    function X() {
        Nq.settings.autoUpgrade = localStorage.getItem(s) === 'true';
        Nq.autoUpgrades = D();
        let Kx = localStorage.getItem(Z);
        if (Kx != null) {
            try {
                Nq.autoUpgrades = M(Kx);
            } catch (KK) {
                console.warn('Ignoring invalid auto upgrade hash', KK);
            }
        }
        Y();
        let Ky = document.getElementById('settingscheckboxautoUpgrade');
        if (Ky != null)
            Ky.checked = Nq.settings.autoUpgrade;
    }
    function E(Kx, Ky) {
        let KK = l[Kx];
        if (KK == null)
            return Kx;
        return KK[Math.min(Ky, KK.length - 1)];
    }
    function e() {
        r(Nq.autoUpgrades);
        let Kx = {};
        let Ky = document.querySelectorAll('#autoUpgradeLevels select[data-level]');
        for (let KK of Ky) {
            for (let Ku of KK.options) {
                Ku.textContent = E(Ku.value, Kx[Ku.value] ?? 0);
                Ku.disabled = !g(Ku.value, Kx);
            }
            let KO = Nq.autoUpgrades[KK.dataset.level];
            KK.value = KO;
            Kx[KO] = (Kx[KO] ?? 0) + 1;
        }
    }
    function L() {
        let Kx = document.getElementById('autoUpgradeLevels');
        if (Kx == null)
            return;
        Kx.innerHTML = '';
        for (let Ky of h) {
            let KK = document.createElement('label');
            KK.className = 'auto-upgrade-level';
            let KO = document.createElement('span');
            KO.textContent = 'Level ' + (Number(Ky) + 1);
            KK.appendChild(KO);
            let Ku = document.createElement('select');
            Ku.dataset.level = Ky;
            for (let KW of W[Ky]) {
                let KB = document.createElement('option');
                KB.value = KW;
                Ku.appendChild(KB);
            }
            Ku.value = Nq.autoUpgrades[Ky];
            Ku.addEventListener('change', () => {
                Nq.autoUpgrades[Ky] = Ku.value;
                Y();
                e();
            }
            );
            KK.appendChild(Ku);
            Kx.appendChild(KK);
        }
        e();
    }
    function S(Kx) {
        let Ky = h[Nq.autoUpgradeStep];
        Nq.autoUpgradeStep++;
        if (!Nq.settings.autoUpgrade || Ky == null)
            return null;
        let KK = Nq.autoUpgrades[Ky];
        return Kx.find(KO => KO.id === KK) ?? null;
    }
    function A() {
        Nq.autoUpgradeStep = 0;
    }
    function k(Kx) {
        if (navigator.clipboard != null && window.isSecureContext) {
            return navigator.clipboard.writeText(Kx);
        }
        let Ky = document.createElement('textarea');
        Ky.value = Kx;
        Ky.setAttribute('readonly', '');
        Ky.style.position = 'fixed';
        Ky.style.opacity = '0';
        document.body.appendChild(Ky);
        Ky.select();
        let KK = document.execCommand('copy');
        Ky.remove();
        if (!KK)
            return Promise.reject(new Error('Clipboard copy failed'));
        return Promise.resolve();
    }
    window.openAutoUpgradeMenu = function() {
        L();
        document.getElementById('settingscheckboxautoUpgrade').checked = Nq.settings.autoUpgrade;
        document.getElementById('autoUpgradeMenu').style.visibility = 'visible';
    }
    ;
    window.setAutoUpgradeEnabled = function(Kx) {
        Nq.settings.autoUpgrade = Boolean(Kx);
        localStorage.setItem(s, Nq.settings.autoUpgrade);
    }
    ;
    window.exportAutoUpgrades = async function() {
        let Kx = Y();
        try {
            await k(Kx);
            alert('copied to clipboard!');
        } catch (Ky) {
            console.error('Could not copy auto upgrade hash', Ky);
            alert('Could not copy the auto upgrade hash.');
        }
    }
    ;
    window.importAutoUpgrades = function() {
        let Kx = document.getElementById('autoUpgradeImport');
        try {
            Nq.autoUpgrades = M(Kx.value.trim());
            Kx.value = Y();
            L();
        } catch (Ky) {
            console.warn('Could not import auto upgrades', Ky);
            alert('Invalid auto upgrade hash.');
        }
    }
    ;
    const o = {
        'cliffs': {
            'bgtop': '#488eff',
            'bgbottom': 'rgb(222, 240, 255)',
            'fog': 'none',
            'color': '#8be58b',
            'water': '#0284ff'
        },
        'plains': {
            'bgtop': '#73A7FC',
            'bgbottom': 'rgb(188,225,255)',
            'fog': 'none',
            'color': '#8be58b',
            'water': '#0284ff'
        },
        'dry': {
            'bgtop': '#488eff',
            'bgbottom': 'rgb(188,225,255)',
            'fog': 'none',
            'base': '#65757C',
            'color': '#ffee8e',
            'water': '#5c92c4'
        },
        'cliff2': {
            'bgtop': '#488eff',
            'bgbottom': '#cfe3f7',
            'fog': 'none',
            'color': '#8defec',
            'water': '#5c92c4'
        },
        'grave': {
            'bgtop': '#6a787a',
            'bgbottom': '#ccd6e0',
            'fog': 'rgba(30, 30, 30, 0.95)',
            'color': '#8defec',
            'cave': 'no',
            'water': '#758799'
        },
        'grave_night': {
            'bgtop': '#000000',
            'bgbottom': '#49188e',
            'fog': 'rgba(0, 0, 0, 1.0)',
            'color': '#8defec',
            'water': '#758799'
        },
        'trees2': {
            'bgtop': '#488eff',
            'bgbottom': 'rgb(222, 240, 255)',
            'fog': 'none',
            'color': '#88cca3',
            'water': '#0284ff'
        },
        'trees': {
            'bgtop': '#73A7FC',
            'bgbottom': 'rgb(188,225,255)',
            'fog': 'none',
            'color': '#88cca3',
            'water': '#1bdefc'
        },
        'snow': {
            'bgtop': '#488eff',
            'bgbottom': '#e7bcff',
            'fog': 'none',
            'color': '#8eabf2',
            'water': '#4788f7'
        },
        'cave': {
            'bgtop': '#222222',
            'bgbottom': '#222',
            'fog': 'none',
            'color': '#8690a0',
            'water': '#5786b2'
        },
        'labyrinth': {
            'bgtop': '#222222',
            'bgbottom': '#222',
            'fog': 'none',
            'color': '#8690a0',
            'water': '#5786b2'
        },
        'crimson': {
            'bgtop': '#222222',
            'bgbottom': '#220000',
            'fog': 'none',
            'color': '#8690a0',
            'water': '#911d12'
        },
        'erthium': {
            'bgtop': '#000000',
            'bgbottom': '#4b2e60',
            'fog': 'none',
            'color': '#e388ef',
            'water': '#af16dd'
        },
        'enchanted': {
            'bgtop': '#c27ba0',
            'bgbottom': '#6d9eebff',
            'fog': 'rgba(117, 51, 232, 0.00)',
            'color': '#e388ef',
            'water': '#af16dd'
        },
        'oldcliff2': {
            'bgtop': '#9fcdfc',
            'bgbottom': '#cfe3f7',
            'fog': 'rgba(100, 100, 100, 0.0)',
            'color': '#8bedce',
            'water': '#5c92c4'
        },
        'jungle': {
            'bgtop': '#43a7e4',
            'bgbottom': '#ccf8f6',
            'fog': 'none',
            'color': '#AED061',
            'water': '#47c5e8'
        },
        'ocean': {
            'bgtop': '#0b5394',
            'bgbottom': '#000a14',
            'fog': 'none',
            'color': '#AED061',
            'water': '#006cb5',
            'waterSurface': {
                'r': 3,
                'g': 120,
                'b': 191
            },
            'waterDeep': {
                'r': 0,
                'g': 10,
                'b': 44
            },
            'fog': 'rgba(0, 123, 210, 0.4)',
            'area': 'ocean'
        },
        'deepocean': {
            'bgtop': '#083760',
            'bgbottom': '#000000',
            'fog': 'none',
            'color': '#AED061',
            'water': '#006cb5',
            'waterSurface': {
                'r': 3,
                'g': 120,
                'b': 191
            },
            'waterDeep': {
                'r': 0,
                'g': 10,
                'b': 44
            },
            'fog': 'rgba(0, 70, 170, 0.4)',
            'area': 'ocean'
        },
        'abyss': {
            'bgtop': '#000000',
            'bgbottom': '#000000',
            'fog': 'none',
            'color': '#000000',
            'water': '#006cb5',
            'waterSurface': {
                'r': 3,
                'g': 120,
                'b': 191
            },
            'waterDeep': {
                'r': 0,
                'g': 10,
                'b': 44
            },
            'fog': 'none',
            'area': 'ocean'
        },
        'beach': {
            'bgtop': '#488eff',
            'bgbottom': '#a2dcf9',
            'fog': 'none',
            'color': '#AED061',
            'water': '#006cb5',
            'waterSurface': {
                'r': 3,
                'g': 120,
                'b': 191
            },
            'waterDeep': {
                'r': 0,
                'g': 10,
                'b': 44
            },
            'fog': 'none',
            'area': 'ocean'
        },
        'desert': {
            'bgtop': '#488eff',
            'bgbottom': 'rgb(222, 240, 255)',
            'fog': 'none',
            'water': '#6f9cc4',
            'color': '#e8c071'
        },
        'desertcave': {
            'bgtop': '#222222',
            'bgbottom': '#222',
            'fog': 'none',
            'color': '#7c6f4f',
            'water': '#7fb3c4'
        },
        'realm13': {
            'bgtop': '#292926ff',
            'bgbottom': 'rgba(130, 122, 105, 1)',
            'fog': 'none',
            'color': '#AED061',
            'water': '#1e2123ff',
            'waterSurface': {
                'r': 3,
                'g': 120,
                'b': 191
            },
            'waterDeep': {
                'r': 0,
                'g': 10,
                'b': 44
            },
            'fog': 'rgba(15, 6, 0, 1.0)',
            'fogRadius': 450
        }
    };
    let T = {
        'trees': [{
            'o': -200,
            'a': 1,
            'f': 6,
            'id': 'trees'
        }, {
            'o': -100,
            'a': 1,
            'f': 4,
            'id': 'trees'
        }, {
            'o': 0,
            'a': 1,
            'f': 2,
            'id': 'trees'
        }],
        'trees2': [{
            'o': -360,
            'a': 1,
            'f': 6,
            'id': 'trees2'
        }, {
            'o': -200,
            'a': 1,
            'f': 4,
            'id': 'trees2'
        }, {
            'o': 0,
            'a': 1,
            'f': 2,
            'id': 'trees2'
        }],
        'enchanted': [{
            'o': 0,
            'a': 1,
            'f': 4,
            'id': 'enchantedforest2'
        }, {
            'o': 0,
            'a': 1,
            'f': 2,
            'id': 'enchantedforest'
        }],
        'cliffs': [{
            'o': 0,
            'a': 0.5,
            'f': 8,
            'id': 'spires'
        }, {
            'o': 100,
            'a': 1,
            'f': 4,
            'id': 'spires'
        }],
        'jungle': [{
            'o': 0,
            'a': 0.5,
            'f': 8,
            'id': 'junglespires'
        }, {
            'o': 100,
            'a': 1,
            'f': 4,
            'id': 'junglespires'
        }],
        'plains': [{
            'o': 200,
            'a': 0.5,
            'f': 8,
            'id': 'plains'
        }, {
            'o': 300,
            'a': 1,
            'f': 4,
            'id': 'plains'
        }],
        'cliffsold': [{
            'o': -200,
            'a': 0.5,
            'f': 8,
            'id': 'cliffs'
        }, {
            'o': 0,
            'a': 1,
            'f': 4,
            'id': 'cliffs'
        }],
        'dry': [{
            'o': 240,
            'a': 0.7,
            'f': 8,
            'id': 'plateau'
        }, {
            'o': 400,
            'a': 1,
            'f': 4,
            'id': 'plateau'
        }],
        'labyrinth': [],
        'beach': [{
            'o': 200,
            'a': 1,
            'f': 4,
            'id': 'beach'
        }, {
            'o': 200,
            'a': 1,
            'f': 5,
            'id': 'islands'
        }],
        'cliff2': [{
            'o': 300,
            'a': 0.7,
            'f': 8,
            'id': 'cliff2'
        }, {
            'o': 450,
            'a': 1,
            'f': 6,
            'id': 'forest'
        }, {
            'o': 550,
            'a': 1,
            'f': 4,
            'id': 'forest'
        }],
        'oldcliff2': [{
            'o': 240,
            'a': 0.7,
            'f': 8,
            'id': 'plateau2'
        }, {
            'o': 400,
            'a': 1,
            'f': 4,
            'id': 'plateau2'
        }],
        'grave': [{
            'o': -200,
            'a': 0.5,
            'f': 8,
            'id': 'cliffs'
        }, {
            'o': 0,
            'a': 1,
            'f': 4,
            'id': 'cliffs'
        }],
        'cliff3': [{
            'o': -200,
            'a': 0.5,
            'f': 8,
            'id': 'cliffs'
        }, {
            'o': 0,
            'a': 1,
            'f': 4,
            'id': 'forest'
        }],
        'cave': [{
            'o': 450,
            'a': 0.5,
            'f': 7,
            'id': 'cavebg1'
        }, {
            'o': 100,
            'a': 0.5,
            'f': 8,
            'id': 'cavebg2'
        }, {
            'o': 550,
            'a': 1,
            'f': 3,
            'id': 'cavebg1'
        }, {
            'o': 0,
            'a': 1,
            'f': 4,
            'id': 'cavebg2'
        }],
        'crimson': [{
            'o': 450,
            'a': 0.5,
            'f': 7,
            'id': 'cavebg1'
        }, {
            'o': 100,
            'a': 0.5,
            'f': 8,
            'id': 'cavebg2'
        }, {
            'o': 550,
            'a': 1,
            'f': 3,
            'id': 'cavebg1'
        }, {
            'o': 0,
            'a': 1,
            'f': 4,
            'id': 'cavebg2'
        }],
        'snow': [{
            'o': -200,
            'a': 0.5,
            'f': 16,
            'id': 'icebg2'
        }, {
            'o': -40,
            'a': 1,
            'f': 7,
            'id': 'icebg2'
        }, {
            'o': 0,
            'a': 1,
            'f': 3,
            'id': 'icebg1'
        }],
        'erthium': [{
            'o': 450,
            'a': 0.5,
            'f': 7,
            'id': 'cavebg1'
        }, {
            'o': 100,
            'a': 0.5,
            'f': 8,
            'id': 'cavebg2'
        }, {
            'o': 550,
            'a': 1,
            'f': 3,
            'id': 'cavebg1'
        }, {
            'o': 0,
            'a': 1,
            'f': 4,
            'id': 'cavebg2'
        }],
        'ocean': [{
            'o': 200,
            'a': 0.5,
            'f': 7,
            'id': 'coral'
        }, {
            'o': 470,
            'a': 1,
            'f': 3,
            'id': 'coral'
        }],
        'abyss': [],
        'deepocean': [],
        'desert': [{
            'o': 100,
            'a': 0.5,
            'f': 8,
            'id': 'dunes'
        }],
        'desertcave': [{
            'o': 450,
            'a': 0.5,
            'f': 7,
            'id': 'cavebg1'
        }, {
            'o': 100,
            'a': 0.5,
            'f': 8,
            'id': 'cavebg2'
        }, {
            'o': -100,
            'a': 1,
            'f': 4,
            'id': 'obelisks'
        }],
        'realm13': [{
            'o': -200,
            'a': 0.3,
            'f': 16,
            'id': 'realm'
        }, {
            'o': -100,
            'a': 1,
            'f': 4,
            'id': 'obelisks'
        }]
    };
    const J = {
        'NoWeapon': ['', 'none', 'none'],
        'Swordsman': ['Swing a sword!', 'swing', 'none'],
        'Magician': ['Shoot magic bolts!', 'slash', 'none'],
        'Archer': ['Shoot arrows!', 'slash', 'none'],
        'Gunner': ['Fire bullets!', 'slash', 'none'],
        'Sniper': ['Snipe enemies!', 'gun', 'none'],
        'Grenadier': ['Throw grenades!', 'slash', 'none'],
        'Bomber': ['Throw large bombs!', 'slash', 'none'],
        'Marksman': ['Shoot two arrows!', 'slash', 'none'],
        'Rocketeer': ['Fire rockets!', 'slash', 'none'],
        'Behemoth': ['Swing a greatsword!', 'slash', 'none'],
        'Shield': ['Block projectiles!', 'slash', 'none'],
        'Umbrellar': ['Rain magic drops!', 'slash', 'none'],
        'Sorcerer': ['Shoot exploding fireballs!', 'slash', 'none'],
        'Charge Blaster': ['Accelerative magic!', 'slash', 'none'],
        'Paladin': ['Smash enemies!', 'whoosh', 'none'],
        'Scythe': ['Spin a deadly scythe!', 'slash', 'none'],
        'Puncher': ['Punch enemies!', 'slash', 'none'],
        'Lancer': ['Poke enemies!', 'slash', 'none'],
        'Dragoon': ['Poke better!', 'slash', 'none'],
        'Giant': ['Jump on enemies!', 'slash', 'none'],
        'Aura Shield': ['Cast a revolving shield!', 'slash', 'none'],
        'Aura Monk': ['Double shields!', 'slash', 'none'],
        'Arms': ['Premium class - Pick up and throw enemies!', 'slash', 'none'],
        'Zaz Field': ['Premium class - Cast a thin shield around you!', 'slash', 'none'],
        'Hook': ['Premium class - hook enemies and grab to walls!', 'slash', 'none'],
        'Thing': ['the thing', 'slash', 'none'],
        'Crossbower': ['Accurate arrows!', 'slash', 'none'],
        'Mirror': ['Deflect projectiles!', 'slash', 'none'],
        'Star Blaster': ['Cast exploding stars!', 'slash', 'none'],
        'Fire Caster': ['Field of fire!', 'slash', 'none'],
        'Winged Bow': ['Flurry of arrows!', 'slash', 'none'],
        'Flame Monk': ['Balls of fire rotate around you!', 'slash', 'none'],
        'Solar Flare': ['Flaming whip!', 'slash', 'none'],
        'Mana Flail': ['Cast a heavy magic flail around you!', 'slash', 'none'],
        'Infernal Mage': ['Ring of fire!', 'slash', 'none'],
        'Shotgun': ['Cluster of bullets!', 'gun', 'none'],
        'Boomstick': ['Massive cluster of bullets!', 'gun', 'none'],
        'Champion': ['Spiky hammer!', 'whooshFast', 'none'],
        'Alchemist': ['Potions!', 'slash', 'none'],
        'Holy Hammer': ['Powerful, heavy hammer!', 'whooshFast', 'none'],
        'Pulse Gun': ['Shoot plasma!', 'slash', 'none'],
        'Rune Wizard': ['Rotating magic cannon!', 'slash', 'none'],
        'Spear': ['Stab enemies!', 'slash', 'none'],
        'Sabre': ['Slice enemies!', 'none'],
        'Cake Cannon': ['Throw cake!', 'slash', 'none'],
        'Gatling Gun': ['Bullet storm!', 'slash', 'none'],
        'Katana': ['Cut enemies swiftly!', 'slash', 'none'],
        'Blunderbuss': ['Fire heavy slugs!', 'slash', 'none'],
        'Excalibur': ['An ancient sword!', 'slash', 'none'],
        'Slasher': ['Slash enemies!', 'slash', 'none'],
        'Frost Staff': ['Shoot frozen shards!', 'slash', 'none'],
        'brew': [''],
        'Pistol': ['Shoot at many angles!', '', ''],
        'Cannon': ['Fire cannonballs!', '', ''],
        'Death Sabre': ['Slice extremely fast!', '', ''],
        'Spork': ['Spoon plus fork!', '', ''],
        'Railgun': ['Snipe with plasma!', '', ''],
        'Cyber Blaster': ['Chaotic lasers!', '', ''],
        'Blizzard Staff': ['Burst damage!', '', ''],
        'Mace': ['Smash spikes in your enemies faces!', '', ''],
        'Spitter': ['Cast toxic sludge!', '', ''],
        'Fume Breather': ['Cast toxic fumes!', '', ''],
        'Spanomancer': ['A very long wand!', '', ''],
        'Clipper': ['Fire bursts of energy!', '', ''],
        'Flamethrower': ['Burn enemies!', '', ''],
        'Shurikenier': ['Throw shurikens!', '', ''],
        'Knife Thrower': ['Throw two knives!', '', ''],
        'Assassin': ['Throw three blades!', '', ''],
        'Berserker': ['Swing a giant axe!', '', ''],
        'Jouster': ['Better poking!', '', ''],
        'Fang': ['Double blades!', '', ''],
        'Boomeranger': ['Throw a boomerang!', '', ''],
        'Storm Rider': ['Fire storm clouds!', '', ''],
        'Slap Hand': ['Slap enemies!', '', ''],
        'Sharpshooter': ['Laser arrows!', '', ''],
        'Cake Blaster': ['Blast cake!', '', ''],
        'Meteor Staff': ['Summon meteors!', '', ''],
        'Flower Mage': ['Flowers increase damage!', '', ''],
        'Zen Monk': ['Cast rotating orbs!', '', ''],
        'Orb Sage': ['Cast an extra orb!', '', ''],
        'Plasma Dagger': ['Melee and ranged!', '', ''],
        'Plasma Spear': ['Zappy spear!', '', ''],
        'Executor': ['Execute', '', ''],
        'Whirlpooler': ['Cast powerful whirlpools!', '', ''],
        'Reflector': ['Tripple mirrors!', '', ''],
        'Aura Master': ['Triple shields!', '', ''],
        'Chrome Orb': ['Return to sender!', '', '']
    };
    class d {
        static particles = {
            'rain': {
                'color': 'rgba(192, 216, 255, 0.5)',
                'shape': 'square'
            },
            'acidrain': {
                'color': 'rgba(88, 249, 99, 0.5)',
                'shape': 'square'
            },
            'snow': {
                'color': 'rgba(255, 255, 255, 0.8)',
                'shape': 'circle'
            },
            'dust': {
                'color': 'rgba(228, 224, 159, 0.24)',
                'shape': 'circle'
            }
        };
        constructor() {
            this.weatherState = {
                'density': 0,
                'vY': 0,
                'vX': 0,
                'vSwish': 0,
                'rSwish': 0,
                'render': 'rain'
            };
            this.weather = {
                'density': 0,
                'vY': 0,
                'vX': 0,
                'vSwish': 0,
                'rSwish': 0,
                'render': 'rain'
            };
            this.particles = [];
        }
        ['setWeather'](Kx) {
            this.weather = Kx;
        }
        ['_updateWeather']() {
            for (let Kx in this.weatherState) {
                let Ky = this.weatherState[Kx];
                let KK = this.weather[Kx];
                if (typeof KK !== 'number')
                    continue;
                let KO = KK - Ky;
                let Ku = Math.min(50, Math.max(2, Math.abs(KO) * 0.15));
                Ky += Math.sign(KO) * Ku;
                if (Math.abs(KO) < Ku)
                    Ky = KK;
                this.weatherState[Kx] = Math.round(Ky);
            }
            while (this.particles.length !== this.weatherState.density) {
                if (this.particles.length > this.weatherState.density) {
                    this.particles.pop();
                } else if (this.particles.length < this.weather.density) {
                    this.particles.push({
                        'x': Math.random() * NQ.width,
                        'y': Math.random() * NQ.height,
                        'hidden': !![],
                        'particle': this.weather.render
                    });
                }
            }
        }
        ['renderWeather'](Kx, Ky) {
            this._updateWeather();
            let KK = NQ.height;
            let KO = NQ.width;
            let Ku = Date.now() / 1000;
            let KW = this.weatherState.vY / 60;
            let KB = this.weatherState.vX / 60;
            let Kl = this.weatherState.vSwish / 60;
            let Ks = this.weatherState.rSwish;
            for (let KZ = 0; KZ < this.particles.length; KZ++) {
                let Kp = this.particles[KZ];
                let Kh = Ks * Math.sin(Kl * Ku + KZ * 997);
                Kp.x = xf(Kp.x + KB + Kh, KO);
                let Kg = Kp.y + KW;
                if (Kg >= KK) {
                    Kp.hidden = ![];
                    Kp.particle = this.weather.render;
                }
                Kp.y = xf(Kg, KK);
                if (Kp.hidden)
                    continue;
                NM.fillStyle = d.particles[Kp.particle].color;
                let Kr = d.particles[Kp.particle].shape;
                let KD = xf(-Kx + Kp.x, NQ.width);
                let KQ = xf(-Ky + Kp.y, NQ.height);
                switch (Kr) {
                case 'square':
                    NM.fillRect(KD, KQ, 4, 20);
                    break;
                case 'circle':
                    NM.beginPath();
                    NM.arc(KD, KQ, 5, 0, Math.PI * 2);
                    NM.fill();
                    break;
                }
            }
        }
    }
    class w {
        constructor() {
            const Kx = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new Kx();
            this._buffers = {};
            this._downloadPromises = {};
            this.volume = 1;
            this.doPan = !![];
            this._musicTracks = {};
            this._musicElements = {};
            this._musicAudio = null;
            this._musicOutgoing = null;
            this._currentMusicId = null;
            this._requestedMusic = null;
            this._musicTransitionFrame = null;
            this._musicRequestVersion = 0;
            this._musicStartPromise = null;
            this._audioUnlocked = this.audioCtx.state === 'running';
            this._unlockHandler = () => {
                this.unlockAudio();
            }
            ;
            ['pointerdown', 'keydown', 'touchstart'].forEach(Ky => {
                document.addEventListener(Ky, this._unlockHandler, {
                    'capture': !![],
                    'passive': !![]
                });
            }
            );
        }
        ['_removeUnlockListeners']() {
            if (!this._unlockHandler)
                return;
            ['pointerdown', 'keydown', 'touchstart'].forEach(Kx => {
                document.removeEventListener(Kx, this._unlockHandler, {
                    'capture': !![]
                });
            }
            );
            this._unlockHandler = null;
        }
        ['unlockAudio']() {
            if (this.audioCtx.state !== 'running') {
                this.audioCtx.resume().then( () => {
                    this._audioUnlocked = !![];
                }
                )['catch'](Kx => {
                    console.warn('Unable to resume audio', Kx);
                }
                );
            } else {
                this._audioUnlocked = !![];
            }
            if (this._requestedMusic) {
                this._startRequestedMusic();
            }
        }
        async download(Kx, Ky) {
            const KK = gameAsset(Ky);
            if (!this._downloadPromises[KK]) {
                this._downloadPromises[KK] = fetch(KK).then(KO => {
                    if (!KO.ok) {
                        throw new Error('Failed to download ' + KK + ': ' + KO.status);
                    }
                    return KO.arrayBuffer();
                }
                ).then(KO => this.audioCtx.decodeAudioData(KO))['catch'](KO => {
                    delete this._downloadPromises[KK];
                    throw KO;
                }
                );
            }
            this._buffers[Kx] = await this._downloadPromises[KK];
        }
        ['playSound'](Kx, Ky=1, KK=0) {
            if (!(Kx in this._buffers))
                return;
            const KO = this.audioCtx.createGain();
            KO.gain.value = Ky * this.volume;
            const Ku = new StereoPannerNode(this.audioCtx,{
                'pan': this.doPan ? KK : 0
            });
            const KW = this.audioCtx.createBufferSource();
            KW.buffer = this._buffers[Kx];
            KW.connect(KO).connect(Ku).connect(this.audioCtx.destination);
            KW.start();
        }
        ['registerMusic'](Kx, Ky) {
            this._musicTracks[Kx] = Ky;
        }
        ['startMusic'](Kx, Ky=1) {
            if (this._currentMusicId === Kx || this._requestedMusic?.id === Kx) {
                return;
            }
            return this.playMusic(Kx, 0.8, Ky);
        }
        ['playMusic'](Kx, Ky=0.8, KK=1) {
            const KO = this._musicTracks[Kx] || Kx;
            if (typeof KO !== 'string') {
                console.warn('Unknown music track: ' + Kx);
                return Promise.resolve(![]);
            }
            this._requestedMusic = {
                'id': Kx,
                'source': KO,
                'fadeMs': Math.max(0, Ky < 10 ? Ky * 1000 : Ky),
                'volume': Math.max(0, Math.min(1, Number(KK) || 0))
            };
            return this._startRequestedMusic();
        }
        ['_startRequestedMusic']() {
            if (this._musicStartPromise) {
                return this._musicStartPromise;
            }
            this._musicStartPromise = this.__startRequestedMusic()['finally']( () => {
                this._musicStartPromise = null;
            }
            );
            return this._musicStartPromise;
        }
        async __startRequestedMusic() {
            const Kx = this._requestedMusic;
            if (!Kx) {
                return ![];
            }
            if (this._musicAudio && this._currentMusicId === Kx.id && !this._musicAudio.paused) {
                this._musicAudio._musicBaseVolume = Kx.volume;
                this._applyMusicVolume(this._musicAudio);
                this._requestedMusic = null;
                return !![];
            }
            const Ky = ++this._musicRequestVersion;
            let KK = this._musicElements[Kx.source];
            if (!KK) {
                KK = new Audio();
                KK.loop = !![];
                KK.preload = 'auto';
                KK.src = Kx.source;
                this._musicElements[Kx.source] = KK;
            }
            KK.loop = !![];
            KK._musicBaseVolume = Kx.volume;
            KK._musicMix = Kx.fadeMs > 0 ? 0 : 1;
            this._applyMusicVolume(KK);
            try {
                await KK.play();
            } catch (Ku) {
                if (Ky === this._musicRequestVersion) {
                    this._audioUnlocked = ![];
                    console.warn('Music is waiting for browser interaction');
                }
                return ![];
            }
            this._audioUnlocked = !![];
            this._removeUnlockListeners();
            if (Ky !== this._musicRequestVersion) {
                KK.pause();
                return ![];
            }
            const KO = this._musicAudio;
            if (KO === KK) {
                this._musicAudio = KK;
                this._currentMusicId = Kx.id;
                this._requestedMusic = null;
                KK._musicMix = 1;
                KK._musicBaseVolume = Kx.volume;
                this._applyMusicVolume(KK);
                return !![];
            }
            this._musicAudio = KK;
            this._currentMusicId = Kx.id;
            this._requestedMusic = null;
            this._crossfadeMusic(KO, KK, Kx.fadeMs);
            return !![];
        }
        ['_crossfadeMusic'](Kx, Ky, KK) {
            if (this._musicTransitionFrame) {
                cancelAnimationFrame(this._musicTransitionFrame);
                this._musicTransitionFrame = null;
            }
            if (this._musicOutgoing && this._musicOutgoing !== Kx) {
                this._musicOutgoing.pause();
                this._musicOutgoing.currentTime = 0;
                this._musicOutgoing._musicMix = 1;
            }
            this._musicOutgoing = Kx || null;
            if (!Kx || KK === 0) {
                if (Kx) {
                    Kx.pause();
                    Kx.currentTime = 0;
                    Kx._musicMix = 1;
                }
                this._musicOutgoing = null;
                Ky._musicMix = 1;
                this._applyMusicVolume(Ky);
                return;
            }
            const KO = Kx._musicMix ?? 1;
            const Ku = performance.now();
            const KW = KB => {
                const Kl = Math.min(1, (KB - Ku) / KK);
                Kx._musicMix = KO * (1 - Kl);
                Ky._musicMix = Kl;
                this._applyMusicVolume(Kx);
                this._applyMusicVolume(Ky);
                if (Kl < 1) {
                    this._musicTransitionFrame = requestAnimationFrame(KW);
                } else {
                    Kx.pause();
                    Kx.currentTime = 0;
                    Kx._musicMix = 1;
                    this._musicOutgoing = null;
                    this._musicTransitionFrame = null;
                }
            }
            ;
            this._musicTransitionFrame = requestAnimationFrame(KW);
        }
        ['_applyMusicVolume'](Kx) {
            const Ky = Number(Nq?.settings?.musicVolume);
            const KK = Number.isFinite(Ky) ? Ky / 100 : 1;
            Kx.volume = Math.max(0, Math.min(1, KK * (Kx._musicBaseVolume ?? 1) * (Kx._musicMix ?? 1)));
        }
        ['changeMusicVolume']() {
            if (this._musicAudio) {
                this._applyMusicVolume(this._musicAudio);
            }
            if (this._musicOutgoing && this._musicOutgoing !== this._musicAudio) {
                this._applyMusicVolume(this._musicOutgoing);
            }
        }
    }
    const P = new w();
    async function H() {
        const Kx = {
            'slash': '/sounds/swing.flac',
            'gun': '/sounds/gun.wav',
            'whoosh': '/sounds/whoosh.wav',
            'whooshFast': '/sounds/whooshFast.mp3',
            'swing': '/sounds/swing.flac',
            'magic': '/sounds/magic.wav',
            'magic2': '/sounds/magic2.mp3',
            'bow': '/sounds/bow.mp3',
            'rocket': '/sounds/rocket.mp3'
        };
        for (const Ky in Kx) {
            P.download(Ky, Kx[Ky])['catch'](KK => {
                console.warn('Failed to load sound ' + Ky, KK);
            }
            );
        }
        P.registerMusic('main', gameAsset('/sounds/realmz_main_theme.mp3'));
    }
    H();
    class t {
        constructor(Kx, Ky, KK, KO) {
            this.p = Kx;
            this.max = Ky;
            this.iterations = 0;
            this.callback = KK;
            this['delete'] = ![];
            this.then = KO ?? function() {}
            ;
        }
        ['update']() {
            this.callback(this.p, this.iterations, this);
            this.iterations++;
            if (this.iterations == this.max)
                this.destroy();
        }
        ['destroy']() {
            this['delete'] = !![];
        }
        static add() {
            t.objs.push(new t(...arguments));
        }
        static update() {
            for (let Kx = 0; Kx < t.objs.length; Kx++) {
                if (t.objs[Kx]['delete']) {
                    t.objs.splice(Kx, 1);
                    Kx--;
                    continue;
                }
                t.objs[Kx].update();
            }
        }
    }
    t.objs = [];
    function V(Kx) {
        let Ky = Kx.x;
        let KK = Kx.y;
        let KO = [];
        let Ku = Math.floor(Ky / 100);
        let KW = Math.floor(KK / 90);
        let KB = KW * Nq.mapwidth + Ku;
        let Kl = Ks => {
            let KZ = Kp => {
                return Kp >= 0 && Kp < Nq.mapwidth * Nq.mapheight;
            }
            ;
            if (KZ(Ks - 1))
                KO.push(Ks - 1);
            if (KZ(Ks))
                KO.push(Ks);
            if (KZ(Ks + 1))
                KO.push(Ks + 1);
        }
        ;
        Kl(KB - Nq.mapwidth);
        Kl(KB);
        Kl(KB + Nq.mapwidth);
        return KO;
    }
    const j = {
        'keys': {
            'aDown': ![],
            'dDown': ![],
            'wDown': ![],
            'pDown': ![],
            'iDown': ![]
        },
        'keyQueue': [2],
        'air': ![],
        'setLast': !![],
        'serverTick': 0,
        'MOVEMENT_TYPE': 0,
        'clientTick': 0,
        'lastTick': Date.now(),
        'viewX': 0,
        'viewY': 0,
        'lastCheck': 0,
        'jumping': ![],
        'cache': [],
        'extrajump': {
            'val': 1,
            'max': 1
        },
        'x': 0,
        'lastX': 0,
        'sz': {
            'val': 58
        },
        'jump': {
            'val': 5,
            'lock': ![]
        },
        'y': 0,
        'lastY': 0,
        'idtick': 0,
        'queue': [],
        'k': 0,
        'vX': 0,
        's': {
            'val': 13
        },
        'gravity': 13,
        'last': Date.now(),
        'vY': 0,
        'movementQueue': [],
        'movementLock': ![],
        'handleKey': (Kx, Ky) => {
            setKey.bind(j)({
                'id': Kx,
                's': Ky
            });
        }
        ,
        'getX': () => {
            let Kx = (Date.now() - j.lastTick) / 50;
            if (Kx > 1.5)
                Kx = 1.5;
            return Math.round(Kx * (j.x - j.lastX) + j.lastX);
        }
        ,
        'getY': () => {
            let Kx = (Date.now() - j.lastTick) / 50;
            if (Kx > 1.5)
                Kx = 1.5;
            return Math.round(Kx * (j.y - j.lastY) + j.lastY);
        }
        ,
        'tick': () => {
            j.lastX = j.x;
            j.lastY = j.y;
            j.lastTick = Date.now();
            move.bind(j)();
        }
        ,
        'reconcile'(Kx) {
            if (Kx.lastCheck == null || Kx.lastCheck == 0 || j.cache.length == 0)
                return;
            if (j.cache[0].id >= Kx.lastCheck)
                return;
            while (!![]) {
                if (j.cache.length == 0)
                    return;
                if (Kx.lastCheck != j.cache[0].id) {
                    j.cache.shift();
                } else {
                    break;
                }
            }
            if (Math.abs(j.cache[0].x - Kx.x) > 1) {
                log('reconcile ' + Kx.lastCheck + ' ' + j.cache[0].id);
                log(j.cache[0].x + ' ' + Kx.x + ' ' + j.cache[0].id + ' ' + Kx.lastCheck);
                j.xi = j.getX();
                j.yi = j.getY();
                j.setLast = ![];
                j.cache[0].x = Kx.x;
                j.cache[0].y = Kx.y;
                j.x = Kx.x;
                j.y = Kx.y;
                for (let Ky = 1; Ky < j.cache.length; Ky++) {
                    j.moveX(j.cache[Ky].v * j.cache[Ky].ms / 50);
                    j.moveY(j.cache[Ky].y);
                    j.cache[Ky].x = Math.round(j.x);
                    j.cache[Ky].y = j.y;
                }
                j.x = j.cache[j.cache.length - 1].x;
                j.y = j.cache[j.cache.length - 1].y;
            } else {
                j.lastCheck = Kx.lastCheck;
            }
            j.cache.shift();
        },
        'getBoundingBox': Kx => {
            let Ky = j.sz.val;
            if (Ky > Kx)
                Ky = Kx;
            return [j.x - Ky / 2, j.x + Ky / 2, j.y - Ky / 2, j.y + Ky / 2];
        }
        ,
        'moveX': Kx => {
            moveX.bind(j)(Kx, V, Nq.map);
        }
        ,
        'moveY': Kx => {
            moveY.bind(j)(Kx, V, Nq.map);
        }
        ,
        'do_jump': () => {
            jump.bind(j)(t);
        }
    };
    function c(Kx) {
        let Ky = j.sz.val;
        if (Ky > Kx)
            Ky = Kx;
        return [j.x - Ky / 2, j.x + Ky / 2, j.y - Ky / 2, j.y + Ky / 2];
    }
async function q() {
    const pageUrl = new URL(window.location.href);
    const hostname = pageUrl.hostname.toLowerCase().replace(/\.$/, "");
    const path = pageUrl.pathname + pageUrl.search;

    if (hostname === "arena.realmz.io") {
        return "arena.realmz.io" + path;
    }

    if (hostname.endsWith(".realmz.io")) {
        if (window.AUTO_SERVER_SELECTION === true) {
            try {
                const ping = async (url) => {
                    const start = performance.now();
                    await fetch(url, { mode: "no-cors", cache: "no-store" });
                    return performance.now() - start;
                };

                const [na, eu] = await Promise.all([
                    ping("https://na.realmz.io/ping"),
                    ping("https://eu.realmz.io/ping")
                ]);

                return (eu < na ? "eu.realmz.io" : "na.realmz.io") + path;
            } catch (error) {
                console.warn("[Realmz] Server selection failed; using NA.", error);
            }
        }

        return "na.realmz.io" + path;
    }

    if (hostname.endsWith(".realmz.top")) {
        return "na.realmz.top" + path;
    }

    if (
        hostname === "iogame4.pages.dev" ||
        hostname === "smiledemic.github.io"
    ) {
        return "na.realmz.io";
    }

    if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "[::1]"
    ) {
        const localServer = window.REALMZ_LOCAL_SERVER;

        if (!localServer) {
            console.error(
                "[Realmz] Local hosting detected. Set window.REALMZ_LOCAL_SERVER to your backend hostname."
            );
            return null;
        }

        return String(localServer)
            .replace(/^https?:\/\//i, "")
            .replace(/^wss?:\/\//i, "")
            .replace(/\/+$/, "") + path;
    }

    // Any other hostname is an external static host (GitHub Pages, Netlify,
    // Cloudflare Pages, a custom domain, ...). It does not run the game server,
    // so never fall back to the page's own host: that opens a WebSocket against
    // a static site and leaves the game stuck on "Reconnecting...".
    // Override with window.REALMZ_LOCAL_SERVER in index.html if needed.
    const externalServer = window.REALMZ_LOCAL_SERVER || "na.realmz.io";
    return String(externalServer)
        .replace(/^https?:\/\//i, "")
        .replace(/^wss?:\/\//i, "")
        .replace(/\/+$/, "");
}
    function b(Kx, Ky) {
        let KK = Ky?.[0];

        if (KK == null || KK === '' || KK === 'none') {
            return Kx;
        }

        try {
            let KO = new URL(Kx);
            KO.searchParams.set('server', KK);
            return KO.toString();
        } catch {
            let Ku = Kx.indexOf('#');
            let KW = Ku === -1 ? '' : Kx.substring(Ku);
            let KB = Ku === -1 ? Kx : Kx.substring(0, Ku);

            KB += (KB.includes('?') ? '&' : '?') +
                'server=' + encodeURIComponent(KK);

            return KB + KW;
        }
    }
    class F {
        constructor(Kx, Ky, KK) {
            this._funcs = {
                'open': () => {}
                ,
                'close': () => {}
                ,
                'error': () => {}
            };
            this._funcsBin = {};
// Prevent send/emit from accessing an undefined socket
// while _setupSocket waits for server selection.
            this.ws = {
                readyState: 3,
                bufferedAmount: 0,
                close: () => {},
                send: () => {}
};

            this._setupSocket(Kx, Ky, KK ?? {});
            this.dataTransfer = 0;
        }
async _setupSocket(Kx, Ky, KK) {
    let KO = 'ws://';

    if (location.protocol.match(/https/)) {
        KO = 'wss://';
    }

    if (Kx == null) {
        const KQ = await q();

        if (KQ == null) {
            this.ws = {
                readyState: 3,
                bufferedAmount: 0,
                close: () => {},
                send: () => {}
            };
            return;
        }

        Kx = /^wss?:\/\//.test(KQ) ? KQ : KO + KQ;
    }

    if (!Kx.match(/^wss?:\/\//)) {
        Kx = KO + Kx;
    }

    if (Ky == null) {
        Ky = [];
    }

    Kx = b(Kx, Ky);

    console.log("[Realmz] WebSocket URL:", Kx);

    // IMPORTANT: Keep Ky as the second argument.
    // This supplies Sec-WebSocket-Protocol during the handshake.
    this.ws = new WebSocket(Kx, Ky);
    this.ws.addEventListener('open', () => {
    console.log('[Realmz WS] Connected:', this.ws.url);
    console.log('[Realmz WS] Negotiated protocol:', this.ws.protocol);
});

this.ws.addEventListener('error', () => {
    console.error('[Realmz WS] Connection error:', {
        url: this.ws.url,
        readyState: this.ws.readyState,
        protocolsRequested: Ky
    });
});

this.ws.addEventListener('close', event => {
    console.error('[Realmz WS] Closed:', {
        code: event.code,
        reason: event.reason,
        clean: event.wasClean
    });
});
    this.ws.binaryType = 'arraybuffer';

    this.ws.addEventListener('open', Ku => {
        (KK.open ?? (() => {}))();
        this._funcs?.open(Ku, KK.join);
    });

    this.ws.addEventListener('close', Ku => {
        this._funcs?.close(Ku);
    });

    this.ws.addEventListener('error', Ku => {
        console.log(Ku);
        this._funcs?.error(Ku);
    });

    this.ws.addEventListener('message', Ku => {
        const KW = new Blob([Ku]).size;
        this.dataTransfer += KW;

        try {
            if (typeof Ku.data != 'string') {
                let Ks = new Uint8Array(Ku.data);

                if (Ks[0] in this._funcsBin) {
                    this._funcsBin[Ks[0]](Ks);
                }

                return;
            }

            if (typeof Ku.data == 'string') {
                if (Ku.data[0] in this._funcsBin) {
                    this._funcsBin[Ku.data[0]](Ku.data);
                    return;
                }
            }

            if (Ku.data[0] != '[') {
                return;
            }

            Ku = JSON.parse(Ku.data);

            let KB = Ku[0];
            let Kl = Ku[1];

            if (!(KB in this._funcs)) {
                return;
            }

            this._funcs[KB](...Kl);
        } catch (KZ) {
            console.log(KZ);
            console.log(Ku.data);
        }
    });
}
        ['test']() {
            this.ws.close(3333);
        }
        ['on'](Kx, Ky) {
            this._funcs[Kx] = Ky;
        }
        ['off'](Kx) {
            delete this._funcs[Kx];
        }
        ['offBin'](Kx) {
            delete this._funcsBin[Kx];
        }
        ['bin'](Kx, Ky) {
            this._funcsBin[Kx] = Ky;
        }
        ['switch'](Kx, Ky) {
            console.log('Switching', Kx, Ky);
            this.ws.close(1000, 'switching servers ');
            this._setupSocket(Kx, Ky, {});
        }
        ['emitBinary'](Kx) {
            this.send(Kx);
        }
        ['send'](Kx) {
            if (this.ws && this.ws.readyState === 1)
                this.ws.send(Kx);
        }
        ['emit'](Kx, ...Ky) {
            if (!this.ws || this.ws.readyState !== 1) return;
            let KK = [Kx, new Array(Ky.length)];
            let KO = Ky.length;
            for (let Ku = 0; Ku < KO; Ku++)
                KK[1][Ku] = Ky[Ku];
            if (this.ws.bufferedAmount < 1001)
                this.send(JSON.stringify(KK));
        }
    }
    'use strict';
    const U = (( () => {
        const Kx = 'realmz-analytics-session-seen';
        const Ky = 'realmz-client-session-token';
        const KK = [1, 3, 5, 10, 15, 20];
        const KO = new Set([2, 5, 8, 11, 15, 20, 24, 35, 52, 70, 100]);
        const Ku = new Map([[15, 1], [35, 2], [70, 3]]);
        let KW = null;
        let KB = [];
        function Kl() {
            const KP = window.location?.pathname ?? '/';
            return KP === '/cg' || KP.startsWith('/crazygames') ? 'crazygames' : 'realmz';
        }
        function Ks() {
            if (window.crypto?.randomUUID)
                return window.crypto.randomUUID();
            return Date.now() + '-' + Math.random().toString(16).slice(2);
        }
        function KZ() {
            try {
                const KP = window.localStorage.getItem(Ky);
                if (typeof KP === 'string' && KP.length > 0 && KP.length <= 128)
                    return KP;
                const KH = Ks();
                window.localStorage.setItem(Ky, KH);
                return KH;
            } catch {
                return Ks();
            }
        }
        function Kp() {
            try {
                return window.localStorage.getItem(Kx) !== 'true' && window.localStorage.getItem('playedBefore') !== 'true';
            } catch {
                return ![];
            }
        }
        function Kh() {
            try {
                window.localStorage.setItem(Kx, 'true');
            } catch {}
        }
        function Kg(KP={}) {
            return {
                'level': Number.isFinite(KP.level) ? Math.max(0, Math.floor(KP.level)) : 0,
                'kills': Number.isFinite(KP.kills) ? Math.max(0, Math.floor(KP.kills)) : 0,
                'playerKills': Number.isFinite(KP.playerKills) ? Math.max(0, Math.floor(KP.playerKills)) : 0,
                'deaths': Number.isFinite(KP.deaths) ? Math.max(0, Math.floor(KP.deaths)) : 0,
                'bossKills': Number.isFinite(KP.bossKills) ? Math.max(0, Math.floor(KP.bossKills)) : 0,
                'weapon': typeof KP.weapon === 'string' ? KP.weapon : 'NoWeapon',
                'weaponTier': Number.isFinite(KP.weaponTier) ? Math.max(0, Math.min(3, Math.floor(KP.weaponTier))) : 0
            };
        }
        function Kr() {
            if (!KW?.startedAt)
                return 0;
            return Math.max(0, Math.floor((Date.now() - KW.startedAt) / 1000));
        }
        function KD() {
            return {
                'source': Kl(),
                'build_version': window.REALMZ_BUILD_VERSION ?? 'development',
                'session_id': KW.id,
                'is_first_session': KW.isFirstSession,
                'session_elapsed_s': Kr(),
                'level': KW.state.level,
                'weapon': KW.state.weapon,
                'weapon_tier': KW.state.weaponTier
            };
        }
        function KQ(KP, KH={}) {
            return;
            if (!KW?.started)
                return;
            window.dataLayer = window.dataLayer || [];
            const Kt = {
                'event': KP,
                ...KD(),
                ...KH
            };
            window.dataLayer.push(Kt);
            console.info('[Realmz Analytics]', KP, Kt);
        }
        function KM() {
            for (const KP of KB)
                window.clearTimeout(KP);
            KB = [];
        }
        function KY(KP) {
            KM();
            const KH = Number.isFinite(KP) && KP === 0;
            KW = {
                'id': Ks(),
                'clientSessionToken': KZ(),
                'isFirstSession': Kp() && (KP == null || KH),
                'started': ![],
                'startedAt': null,
                'state': Kg(),
                'weaponsSelected': 0,
                'upgradesSelected': 0,
                'reachedTiers': new Set(),
                'firstMobKillSent': ![],
                'firstDeathSent': ![]
            };
            return {
                'sessionId': KW.id,
                'sessionToken': KW.clientSessionToken,
                'isFirstSession': KW.isFirstSession,
                'isCrazyGames': Kl() === 'crazygames'
            };
        }
        function KX() {
            KB = KK.map(KP => window.setTimeout( () => {
                if (!KW?.started || !Nq.ingame)
                    return;
                Ng.emit('analyticsSnapshotRequest', {
                    'minutes': KP,
                    'sessionId': KW.id
                });
            }
            , KP * 60 * 1000));
        }
        function KE(KP={}) {
            if (!KW || KP.sessionId && KP.sessionId !== KW.id)
                KY();
            if (KW.started)
                return;
            KW.isFirstSession = KP.isFirstSession === !![];
            KW.started = !![];
            KW.startedAt = Date.now();
            KW.state = Kg(KP.snapshot);
            Kh();
            KQ('game_start');
            KX();
        }
        function Kv(KP) {
            if (!KW?.started || !Number.isFinite(KP))
                return;
            const KH = Math.max(0, Math.floor(KP));
            const Kt = KW.state.level;
            if (KH <= Kt)
                return;
            for (let KV = Kt + 1; KV <= KH; KV++) {
                KW.state.level = KV;
                const Kj = Ku.get(KV);
                if (Kj != null)
                    KW.state.weaponTier = Kj;
                if (KO.has(KV))
                    KQ('level_up', {
                        'level': KV
                    });
                if (Kj != null && !KW.reachedTiers.has(Kj)) {
                    KW.reachedTiers.add(Kj);
                    KQ('weapon_tier_reached', {
                        'level': KV,
                        'weapon_tier': Kj
                    });
                }
            }
        }
        function Ke(KP) {
            if (!KW?.started || typeof KP !== 'string' || KP.length === 0)
                return;
            KW.weaponsSelected++;
            KW.state.weapon = KP;
            KQ('weapon_selected', {
                'weapon': KP
            });
        }
        function KL(KP) {
            if (!KW?.started || typeof KP !== 'string' || KP.length === 0)
                return;
            if (KW.upgradesSelected > 0)
                return;
            KW.upgradesSelected++;
            KQ('upgrade_selected', {
                'upgrade': KP
            });
        }
        function KS(KP) {
            const KH = Kg(KP);
            Kv(KH.level);
            KW.state = KH;
        }
        function KA(KP={}) {
            if (!KW?.started || KP.sessionId !== KW.id)
                return;
            if (!KK.includes(KP.minutes))
                return;
            KS(KP.snapshot);
            KQ('playtime_checkpoint', {
                'minutes': KP.minutes,
                'checkpoint_minutes': KP.minutes,
                'kills': KW.state.kills,
                'player_kills': KW.state.playerKills,
                'deaths': KW.state.deaths,
                'boss_kills': KW.state.bossKills,
                'weapons_selected': KW.weaponsSelected,
                'upgrades_selected': KW.upgradesSelected
            });
        }
        function Kk(KP) {
            if (!KW?.started || KW.firstMobKillSent)
                return;
            KW.firstMobKillSent = !![];
            KS(KP);
            KQ('first_mob_kill');
        }
        function Ko(KP={}) {
            if (!KW?.started)
                return;
            KS(KP.snapshot);
            KQ('boss_killed', {
                'boss': KP.boss ?? 'unknown'
            });
        }
        function KT(KP) {
            if (!KW?.started)
                return;
            KS(KP);
            if (!KW.firstDeathSent) {
                KW.firstDeathSent = !![];
                KQ('first_death');
            }
            KJ();
        }
        function KJ() {
            KM();
            if (KW)
                KW.started = ![];
        }
        function Kd() {
            return KW?.id ?? null;
        }
        function Kw() {
            if (!KW)
                return null;
            return {
                'sessionId': KW.id,
                'sessionToken': KW.clientSessionToken,
                'isFirstSession': KW.isFirstSession,
                'isCrazyGames': Kl() === 'crazygames'
            };
        }
        return {
            'prepareSession': KY,
            'startSession': KE,
            'handleLevel': Kv,
            'weaponSelected': Ke,
            'upgradeSelected': KL,
            'handleCheckpoint': KA,
            'handleFirstMobKill': Kk,
            'handleBossKill': Ko,
            'handleDeath': KT,
            'endSession': KJ,
            'getSessionId': Kd,
            'getJoinMetadata': Kw
        };
    }
    )());
    window.gameAnalytics = U;
    class C {
        static set(Kx, Ky, KK) {
            const KO = new Date();
            KO.setTime(KO.getTime() + KK * 24 * 60 * 60 * 1000);
            let Ku = 'expires=' + KO.toUTCString();
            document.cookie = Kx + '=' + Ky + ';' + Ku + ';path=/';
        }
        static['delete'](Kx) {
            document.cookie;
        }
        static get(Kx) {
            let Ky = Kx + '=';
            let KK = document.cookie.split(';');
            for (let KO = 0; KO < KK.length; KO++) {
                let Ku = KK[KO];
                while (Ku.charAt(0) == ' ') {
                    Ku = Ku.substring(1);
                }
                if (Ku.indexOf(Ky) == 0) {
                    return Ku.substring(Ky.length, Ku.length);
                }
            }
            return '';
        }
    }
    const z = {
        'open': Kx => {
            let Ky = i('statusscreen');
            Ky.innerHTML = Kx;
            Ky.style.visibility = 'visible';
        }
        ,
        'close': () => {
            i('statusscreen').style.visibility = 'hidden';
        }
    };
    window.login = async function() {
        let Kx = document.getElementById('nameLogin').value;
        let Ky = document.getElementById('passLogin').value;
        let KK = await fetch(getAPIurl() + '/api/login', {
            'method': 'POST',
            'credentials': 'include',
            'headers': {
                'Content-Type': 'application/json;charset=utf-8'
            },
            'body': JSON.stringify({
                'user': Kx,
                'pass': Ky
            })
        });
        let KO = await KK.json();
        if (!KO.loginSuccess) {
            m('Invalid username or password');
        } else {
            localStorage.setItem('accUsername', KO.u);
            localStorage.setItem('accSSID', KO.s);
            localStorage.setItem('ssid', KO.s);
            f();
            Nq.loggedin = !![];
        }
    }
    ;
    async function f() {
        Ng.emit('login.', localStorage.getItem('accUsername'), localStorage.getItem('accSSID'));
        document.getElementById('ACCOUNT_LOGGED_IN').style.visibility = 'inherit';
        document.getElementById('ACCOUNT_LOGGED_IN').style.position = 'relative';
        document.getElementById('ACCOUNT_LOGIN').style.visibility = 'hidden';
        document.getElementById('ACCOUNT_LOGIN').style.position = 'absolute';
        document.getElementById('accountStatsPanel').style.visibility = 'inherit';
        document.getElementById('accountLoginPanel').classList.remove('open');
        R();
    }
    async function R() {
        let Kx = await fetch(getAPIurl() + '/api/user-info', {
            'credentials': 'include'
        });
        let Ky = await Kx.json();
        Nq.account = Ky;
        yo(Ky.progress?.ffa?.weaponProgress);
        II();
        I4();
        I6(Ky);
        document.getElementById('account_username').innerText = Ky.username;
        let KK = document.getElementById('accountLogginText');
        let KO = 0;
        Nq.lootboxes = Ky.lootboxes;
        let Ku = document.getElementById('cratesArea');
        Ku.innerHTML = '';
        i('account_hands_enable').checked = Ky.handsEnabled ?? ![];
        for (let KB in Ky.lootboxes) {
            KO += Ky.lootboxes[KB];
            if (Ky.lootboxes[KB] == 0)
                continue;
            let Kl = document.createElement('div');
            Kl.setAttribute('class', 'cratething');
            Kl.innerHTML = '<b style = \x22width: 100%; text-indent: 6px; height: 5%;\x22>' + Ky.lootboxes[KB] + '</b> <img src="' + gameAsset('./images/crates/' + KB + '.png') + '" style="height: 75%; aspect-ratio: 4/3; padding: 0; margin: 0;"></img> <button style="width: 70%; height: 20%;" class="defaultbutton" onclick="openCrate(\'' + KB + '\x27)\x22>Open</button>';
            Ku.appendChild(Kl);
        }
        document.getElementById('cscoins').innerHTML = 'Coins: ' + Ky.coins + ' - Total Lootboxes: ' + KO;
        KK.innerHTML = '';
        let KW = Ks => {
            let KZ = document.createElement('div');
            KZ.setAttribute('class', 'statsbox');
            KZ.innerHTML = Ks;
            KK.appendChild(KZ);
        }
        ;
        i('comms').innerHTML = await (await fetch(getAPIurl(!![]) + '/comms')).text();
        i('coinsDisplayShop').innerHTML = Ky.coins;
        i('erthiumDisplayShop').innerHTML = Ky.erthium ?? 0;
        KW('<z><b>Coins: </b>' + Ky.coins + '</z>');
        KW('<z><b>Stars: </b>' + Ky.stars + '</z>');
        KW('<z><b>Total plays: </b>' + Ky.plays + '</z>');
        KW('<z><b>Total kills: </b>' + Ky.kills + '</z>');
        KW('<z><b>Highest Level: </b>' + Ky.record?.level + '</z>');
        KW('<z><b>Most kills: </b>' + Ky.record?.kills + '</z>');
        KW('<z><b>Weapons Discovered: </b>' + yw() + '/' + yd() + '</z>');
        KW('<z><b>Account Age: </b>' + Ky.age + ' days' + '</z>');
        KW('<button type="button" class="shine-subtle statsButton accountStatAction" onclick="openAccountTab(\'missionsContainer\')"><b>Daily Missions:</b> ' + Ky.missions.daily.reduce( (Ks, KZ) => Ks + KZ.complete, 0) + '/' + Ky.missions.daily.length + ' Completed</button>');
        KW('<button type=\x22button\x22 class=\x22shine-subtle statsButton accountStatAction\x22 onclick=\x22openAccountTab(\x27missionsContainer\x27)\x22><b>Weekly Missions:</b> ' + Ky.missions.weekly.reduce( (Ks, KZ) => Ks + KZ.complete, 0) + '/' + Ky.missions.weekly.length + ' Completed</button>');
        KW('<button type="button" class="viewAccountButton" onclick="cosmetics(1)">Skins</button>');
        Nq.skin = Ky.skin;
        n(Ky.skins);
    }
    window.toggleHands = function() {
        let Kx = i('account_hands_enable').checked;
        Ng.emit('toggle_hands', Kx);
    }
    ;
    window.sendDeveloperMessage = function() {
        let Kx = i('devMessage').value;
        i('devMessage').value = '';
        fetch(getAPIurl() + '/api/v2/devmessage', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': localStorage.getItem('accSSID')
            },
            'body': JSON.stringify({
                'msg': Kx
            })
        });
    }
    ;
    window.logout = function() {
        document.getElementById('ACCOUNT_LOGGED_IN').style.visibility = 'hidden';
        document.getElementById('ACCOUNT_LOGGED_IN').style.position = 'absolute';
        document.getElementById('ACCOUNT_LOGIN').style.visibility = 'inherit';
        document.getElementById('ACCOUNT_LOGIN').style.position = 'relative';
        document.getElementById('accountStatsPanel').style.visibility = 'hidden';
        document.getElementById('accountLogginText').innerHTML = 'Log in to see your stats.';
        Ng.emit('logout');
        localStorage.setItem('accUsername', '');
        localStorage.setItem('accSSID', '');
        localStorage.setItem('ssid', '');
        Nq.loggedin = ![];
        fetch(getAPIurl() + '/api/logout', {
            'method': 'POST',
            'credentials': 'include'
        });
    }
    ;
    window.toggleAccountPanel = function() {
        document.getElementById('accountLoginPanel').classList.toggle('open');
    }
    ;
    function m(Kx) {
        document.getElementById('accountErrorBox').innerHTML = Kx;
    }
    window.openLogin = function() {
        let Kx = ' <input type=\x22text\x22 placeholder=\x22Username\x22 class=\x22input\x22 id=\x22nameLogin\x22></input>\x0a      <input type=\x22password\x22 placeholder=\x22Password\x22 class=\x22input\x22 id=\x22passLogin\x22></input>\x0a      <div id=\x22accountButtons\x22>\x0a        <button onclick=\x22login()\x22 class=\x22blueTheme\x22 id=\x22login\x22>Login</button>\x0a        <button id=\x22login\x22 class=\x22blueTheme\x22 onclick=\x22openRegister()\x22>Register</button>\x0a      </div>\x0a      <p id=\x22accountErrorBox\x22></p>';
        document.getElementById('accountTitleText').innerHTML = 'Login';
        document.getElementById('accountInputBox1').innerHTML = Kx;
    }
    ;
    window.registerAccount = async function() {
        let Kx = document.getElementById('nameLogin').value;
        let Ky = document.getElementById('emailLogin').value;
        let KK = document.getElementById('passLogin').value;
        let KO = document.getElementById('passLoginC').value;
        if (KK !== KO) {
            m('Passwords do not match');
            return;
        }
        let Ku = await fetch(getAPIurl() + '/api/register', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json;charset=utf-8'
            },
            'credentials': 'include',
            'body': JSON.stringify({
                'user': Kx,
                'email': Ky,
                'pass': KK
            })
        });
        let KW = await Ku.json();
        console.log(KW);
        if (!KW.registerSuccess) {
            m(KW.error);
        } else {
            m('Success. Logging in...');
            let KB = await fetch(getAPIurl() + '/api/login', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                'credentials': 'include',
                'body': JSON.stringify({
                    'user': Kx,
                    'pass': KK
                })
            });
            localStorage.setItem('accUsername', KB.u);
            localStorage.setItem('accSSID', KB.s);
            localStorage.setItem('ssid', KB.s);
            let Kl = await KB.json();
            f();
        }
    }
    ;
    window.openRegister = function() {
        let Kx = ' <input type="text" placeholder="Username" class="input" id="nameLogin"></input>\n  <input type="text" placeholder="Email" class="input" id="emailLogin"></input>\n      <input type="password" placeholder="Password" class="input" id="passLogin"></input>\n      <input type="password" placeholder="Confirm Password" class="input" id="passLoginC"></input>\n      <div id="accountButtons">\n        <button onclick="openLogin()" class="blueTheme" id="login">Back</button>\n        <button id="login" class="blueTheme" onclick="registerAccount()">Register</button>\n      </div>\n      <p id="accountErrorBox"></p>';
        document.getElementById('accountTitleText').innerHTML = 'Register';
        document.getElementById('accountInputBox1').innerHTML = Kx;
    }
    ;
    window.buyCrate = async function(Kx, Ky) {
        if (Nq.buylock)
            return;
        Nq.buyLock = !![];
        openStatusBox('Processing transaction..');
        let KK = ![];
        setTimeout( () => {
            if (!KK)
                openStatusBox('Transaction timed out: ', !![]);
            Nq.buyLock = ![];
        }
        , 4100);
        let KO = await fetch(getAPIurl() + '/api/buy', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json;charset=utf-8'
            },
            'credentials': 'include',
            'body': JSON.stringify({
                'type': Kx,
                'id': Ky,
                'time': Date.now()
            })
        });
        let Ku = await KO.json();
        KK = !![];
        Nq.buyLock = ![];
        if (Ku.success) {
            closeStatusBox();
        } else {
            openStatusBox('Not enough coins', !![]);
        }
        R();
    }
    ;
    window.openCrate = async function(Kx) {
        if (Nq.openLock)
            return;
        Nq.openLock = !![];
        let Ky = await fetch(getAPIurl() + '/api/open-lootbox', {
            'method': 'POST',
            'credentials': 'include',
            'headers': {
                'Content-Type': 'application/json;charset=utf-8'
            },
            'body': JSON.stringify({
                'type': Kx
            })
        });
        let KK = await Ky.json();
        if (KK.success) {
            let KO = '<img src="' + gameAsset('/images/crates/' + Kx + '.png') + '\x22 style=\x22width: 100%; aspect-ratio: 4/3;\x22></img>';
            for (let Ku in KK.skins)
                KO += '<p style=\x22white-space: nowrap;\x22><b>' + KK.skins[Ku].skin + '</b> - ' + KK.skins[Ku].rarity + '</p>';
            if (KK.refund > 0)
                KO += '<p>Refunded for duplicates: ' + KK.refund + '</p>';
            openStatusBox(KO, !![], {
                'name': 'Open another',
                'onclick': 'openCrate(\'' + Kx + '\x27)'
            });
        } else {
            openStatusBox('Error opening crate', !![]);
        }
        Nq.openLock = ![];
        R();
    }
    ;
    window.cosmetics = function(Kx) {
        let Ky = ['titleTopBar', 'accountStatsPanel', 'CHANGE_BOX', 'MAIN_BOX', 'titleFooter'];
        let KK = document.getElementById('COSMETICS');
        let KO = 'hidden';
        if (!Kx) {
            KK.style.position = 'absolute';
            KK.style.visibility = 'hidden';
            KO = 'inherit';
        } else {
            KK.style.position = 'relative';
            KK.style.visibility = 'visible';
            if (typeof x4 === 'function')
                x4();
        }
        for (let Ku in Ky) {
            let KW = document.getElementById(Ky[Ku]);
            KW.style.visibility = KO;
        }
    }
    ;
    window.openAccountTab = function(Kx) {
        cosmetics(1);
        document.querySelector('#cosmeticTitle button[z="' + Kx + '\x22]')?.click();
    }
    ;
    function n(Kx) {
        let Ky = document.getElementById('skinselector');
        Ky.innerHTML = '';
        let KK = KO => {
            Ky.innerHTML += '<b style=\'padding: 1px 6px 1px 6px\'>' + KO + '</b>';
        }
        ;
        for (let KO in Nq.skins) {
            let Ku = KO == 'special' || KO == 'occasion specials' || KO == 'halloween' || KO == 'christmas' || KO == 'easter 2024' || KO == 'holidays 2024' || KO == 'easter 2025' || KO == 'halloween 2025' || KO == 'christmas 2023' || KO == 'exclusive' || KO == 'quests';
            let KW = ![];
            if (!Ku) {
                KK(KO);
                KW = !![];
            }
            let KB = '<div style=\'display: flex; flex-wrap: wrap; flex; width: 100%; height: min-content; background: #F4F1E1\'>';
            for (let Kl in Nq.skins[KO]) {
                let Ks = ![];
                let KZ = 'text-decoration: line-through;';
                if (Kx.includes(Kl)) {
                    Ks = !![];
                    if (Ku) {
                        if (!KW)
                            KK(KO);
                        KW = !![];
                    }
                    Nq.skins[KO][Kl] = 1;
                    KZ = '';
                } else {
                    Nq.skins[KO][Kl] = 0;
                    if (Ku)
                        continue;
                }
                if (Nq.skin == Kl)
                    KZ += 'color: blue; font-weight: 900';
                KB += '<p class=\'skin1\' z=' + encodeURI(Kl) + ' z1=' + encodeURI(KO) + ' style=\'width: min-content; padding: 4px 12px 4px 12px; margin: 0;' + KZ + '\x27>' + Kl + '</p>';
            }
            KB += '</div>';
            Ky.innerHTML += KB;
        }
    }
    function I0() {}
    function I1() {}
    document.getElementById('skinselector').addEventListener('mouseover', Kx => {
        let Ky = document.getElementById('skinPreview');
        let KK = Ky.getContext('2d');
        let KO = Kx.target.getAttribute('z');
        if (KO == null)
            KO = Nq.skin;
        KO = decodeURI(KO);
        let Ku = Ky;
        KK.clearRect(0, 0, Ku.width, Ku.height);
        let KW = Nc['./images/skins/' + KO + '.svg'];
        let KB = () => {
            KK.clearRect(0, 0, Ku.width, Ku.height);
            KK.drawImage(KW, Ku.width / 2 - KW.width, Ku.height / 2 - KW.height, KW.width * 2, KW.height * 2);
        }
        ;
        if (KW == null) {
            Nc['./images/skins/' + KO + '.svg'] = new Image();
            Nc['./images/skins/' + KO + '.svg'].onerror = gameAssetImageError(gameAsset('./images/skins/' + KO + '.svg'));
            Nc['./images/skins/' + KO + '.svg'].src = gameAsset('./images/skins/' + KO + '.svg');
            KW = Nc['./images/skins/' + KO + '.svg'];
            Nc['./images/skins/' + KO + '.svg'].onload = KB;
            return;
        }
        KB();
    }
    );
    document.getElementById('skinselector').addEventListener('mousedown', Kx => {
        let Ky = Kx.target.getAttribute('z');
        let KK = Kx.target.getAttribute('z1');
        if (Ky == null || KK == null)
            return;
        Ky = decodeURI(Ky);
        KK = decodeURI(KK);
        if (!Nq.skins[KK][Ky])
            return;
        const KO = document.querySelector('p[z=\'' + encodeURI(Nq.skin) + '\x27]');
        KO.style.color = 'black';
        KO.style['font-weight'] = 400;
        Nq.skin = Ky;
        Ng.emit('skin', Ky);
        const Ku = document.querySelector('p[z=\'' + encodeURI(Nq.skin) + '\x27]');
        Ku.style.color = 'blue';
        Ku.style['font-weight'] = 900;
    }
    );
    i('cosmeticTitle').addEventListener('click', Kx => {
        let Ky = Kx.target.getAttribute('z');
        if (Ky == null)
            return;
        let KK = i('COSMETICS');
        for (const KO of KK.children) {
            if (KO.id === 'cosmeticTitle')
                continue;
            if (KO.id !== Ky) {
                KO.style.visibility = 'hidden';
                KO.style.width = '0';
                KO.style.height = '0';
            } else {
                if (KO.id == 'shopContainer')
                    I7();
                if (KO.id == 'missionsContainer') {
                    updateCampaignMissions.update();
                }
                KO.style.visibility = 'inherit';
                KO.style.width = '100%';
                KO.style.height = '90%';
            }
        }
    }
    );
    let I2 = ![];
    async function I3() {
        I2 = !I2;
        await I4();
    }
    window.toggleLegacyLeaderboards = I3;
    async function I4() {
        const Kx = I2 ? '/api/legacy-leaderboards' : '/api/leaderboard';
        let Ky = await fetch(getAPIurl() + Kx);
        Ky = await Ky.json();
        let KK = i('leaderboard');
        const KO = I2 ? [{
            'type': 'legacy_level',
            'label': 'Legacy Highest Level'
        }, {
            'type': 'legacy_kills',
            'label': 'Legacy Most Kills'
        }] : [{
            'type': 'stars',
            'label': 'Most Stars'
        }, {
            'type': 'level',
            'label': 'Highest Level'
        }, {
            'type': 'kills',
            'label': 'Most Kills'
        }];
        const Ku = new Map(Ky.map(Kl => [Kl.type, Kl]));
        let KW = ['#a18300ff', '#47494aff', '#895823ff'];
        KK.replaceChildren();
        for (const Kl of KO) {
            const Ks = Ku.get(Kl.type);
            if (!Ks)
                continue;
            const KZ = document.createElement('div');
            KZ.classList.add('leaderboardSection');
            KZ.style.width = '100%';
            const Kp = document.createElement('j');
            Kp.style.height = '5%';
            Kp.innerText = Kl.label;
            const Kh = document.createElement('div');
            Kh.classList.add('leaderboardContent');
            Kh.style.overflowY = 'auto';
            for (let Kg = 0; Kg < Ks.data.length; Kg++) {
                let Kr = document.createElement('div');
                Kr.classList.add('leaderboardTile');
                let KD = Ks.data[Kg];
                let KQ = KD.skin ?? KD[2];
                let KM = document.createElement('img');
                KM.src = I5('skins', KQ);
                let KY = document.createElement('div');
                KY.style = 'text-overflow: ellipsis;';
                KY.innerText = Kg + 1 + '. ' + (KD.value ?? KD[1]) + ' - ' + (KD.username ?? KD[0]);
                if (KW[Kg]) {
                    KY.style.color = KW[Kg];
                }
                Kr.appendChild(KY);
                Kr.appendChild(KM);
                Kh.appendChild(Kr);
            }
            KZ.appendChild(Kp);
            KZ.appendChild(Kh);
            KK.appendChild(KZ);
        }
        const KB = i('legacyLeaderboardButton');
        if (KB) {
            KB.innerText = I2 ? 'Current leaderboards' : 'Legacy leaderboards';
        }
    }
    function I5(Kx, Ky) {
        Ky = encodeURIComponent(Ky);
        switch (Kx) {
        case 'skins':
            return gameAsset('/images/skins/' + Ky + '.svg');
        case 'crates':
            return gameAsset('/images/crates/' + Ky + '.png');
        }
    }
    window.scrollToElement = function(Kx) {
        i(Kx).scrollIntoView({
            'behavior': 'smooth'
        });
    }
    ;
    const I6 = async function(Kx) {
        let Ky = i('missionContent');
        let KK = '<div class=\x27newshopcontainer\x27>';
        let KO = await gameAssetJSON('/shared/starRanks.json');
        let Ku = Kx.stars;
        function KW(Ks) {
            var KZ = new Date().getTime();
            var Kp = Ks[0].expires - KZ;
            var Kh = Math.floor(Kp / (1000 * 60 * 60 * 24));
            var Kg = Math.floor(Kp % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            var Kr = Math.floor(Kp % (1000 * 60 * 60) / (1000 * 60));
            var KD = Math.floor(Kp % (1000 * 60) / 1000);
            let KQ = Kh + 'd ' + Kg + 'h ' + Kr + 'm ' + KD + 's ';
            return Ks.map(KM => {
                let KY = I8(KM.rewards);
                return '<div class="shopitem2" ' + (KM.complete ? 'style=\x22background: rgba(0, 0, 0, 0.1)\x22' : 'style=\x22\x22') + '>\n                <p><b>' + KM.info + '</b></p>\x0a                <p>' + KQ + '</p>\n                ' + (KM.complete ? '<p>COMPLETE</p>' : '<p>Progress: ' + KM.progress + '/' + KM.goal + '</p>\n                <button style="font-weight: 800;">\n                    Reward: \n                    ' + KY.map(KX => {
                    return KX.value + ' <img src="' + KX.src + '" style="height: 25px; width: 25px;"></img>';
                }
                ).join(' ') + '\n                </button>\n                ') + '\n            </div>';
            }
            ).join('\x0a');
        }
        let KB = {
            'Daily Missions': () => {
                return KW(Kx.missions.daily);
            }
            ,
            'Weekly Missions': () => {
                return KW(Kx.missions.weekly);
            }
            ,
            'Grand Campaign': () => {
                return '<div>\n            <canvas id="missionCanvas" width=1160 height=70></canvas>\n\n                    <div style="display: flex; align-items: center; justify-content: center;">\n                        <div class="arrow" onclick="updateCampaignMissions.down()"></div>\n                        <div id="missionInfo" style="width: 40%;">\n                            <p class="infobox">info on mission</p>\n                            <p><b>Rewards</b></p>\n                            <div class="infobox" style="display: flex; align-items: center;">\n                                5<img class="icon" src="' + gameAsset('./images/coins.png') + '"></img>\n                                4<img class="icon" src="' + gameAsset('./images/erthium.png') + '"></img>\n                            </div>\n                        </div>\n                        <div class="arrow" onclick="updateCampaignMissions.up()"></div>\n                    </div>\n                    </div>';
            }
            ,
            'Star Ranks': () => {
                let Ks = '';
                for (let KZ = 0; KZ < KO.length; KZ++) {
                    let Kp = KO[KZ];
                    let Kh = KO[KZ + 1] ?? {
                        'stars': Infinity
                    };
                    let Kg = KO[KZ - 1] ?? {
                        'stars': 0
                    };
                    let Kr = Kg.stars <= Ku && Ku < Kp.stars;
                    let KD = Ku < Kg.stars;
                    let KQ = Math.round(100 - 100 * (Ku - Kg.stars) / (Kp.stars - Kg.stars));
                    if (KD && !Kr)
                        KQ = 100;
                    Ks += '\x0a                <div>\x0a                    <div class=\x22starProgress\x22>\x0a                    <div class=\x22starProgressDark\x22 style=\x22width: ' + (KD || Kr ? KQ + '%' : '0%') + ';">\n                        ' + (Kr ? '<p style="position: absolute;">' + Ku + '</p>' : '') + '\n                    </div>\n                    </div>\n                    <div style="display: flex; justify-content: flex-end;">\n                    <div style="flex-direction: column">\n                        <p>' + Kp.stars + '</p>\n                        <div class="infobox" style="display: flex; align-items: center;">\n                        ' + I9(Kp.rewards) + '\n                        </div>\n                    </div>\n                    </div>\n                </div>\n                ';
                }
                return Ks;
            }
            ,
            'Referral Program': () => {}
        };
        let Kl = {
            'Star Ranks': '<div style="width: 100%; overflow-x: scroll; display: flex;">'
        };
        for (let Ks in KB) {
            KK += '<button class=\'shopnav\' onclick="scrollToElement(\'missionsSection' + Ks + '\x27)\x22>' + Ks + '</button>';
        }
        KK += '</div>';
        for (let KZ in KB) {
            KK += '<h1 id="missionsSection' + KZ + '\x22>' + KZ + '</h1>';
            KK += Kl[KZ] == null ? '<div class="newshopcontainer">' : Kl[KZ];
            KK += KB[KZ]();
            KK += '</div>';
            KK += '<br/>'.repeat(3);
        }
        Ky.innerHTML = KK;
    };
    const I7 = (function() {
        let Kx = 0;
        let Ky = null;
        return async function() {
            if (Date.now() - Kx > 60 * 1000) {
                Ky = await fetch(getAPIurl() + '/shared/shop.json');
                Ky = await Ky.json();
                Kx = Date.now();
            }
            let KK = i('shopContent');
            KK.innerHTML = '';
            let KO = '<div class=\'newshopcontainer\'>';
            for (let Ku in Ky) {
                KO += '<button class=\'shopnav\' onclick="scrollToElement(\'shopSection' + Ku + '\')">' + Ku + '</button>';
            }
            KO += '</div>';
            for (let KW in Ky) {
                KO += '<h1 id="shopSection' + KW + '\x22>' + KW + '</h1><div class="newshopcontainer">';
                for (let KB in Ky[KW]) {
                    let Kl = Ky[KW][KB];
                    let Ks = '<button onclick=\x22buyCrate(\x27' + KW + '\', \'' + KB + '\')" style="font-weight: 800;">\n                      Buy - ' + Kl.cost + ' <img src="' + gameAsset('./images/' + Kl.type + '.png') + '\x22 style=\x22height: 25px; width: 25px;\x22></img>\x0a                  </button>';
                    let KZ = '';
                    console.log(KB);
                    if (Nq.account.skins.includes(KB)) {
                        Ks = 'OWNED';
                        KZ = 'style="background: rgba(0, 0, 0, 0.1);"';
                    }
                    KO += '\x0a                <div class=\x22shopitem2\x22 ' + KZ + '>\n                  <p><b>' + KB + '</b></p>\n                  <img src="' + I5(KW, KB) + '"></img>\n                  <p>' + Kl.desc + '</p>\n                  ' + Ks + '\x0a                </div>\x0a              ';
                }
                KO += '</div>';
            }
            KK.innerHTML = KO;
        }
        ;
    }());
    function I8(Kx) {
        let Ky = [];
        for (let KK in Kx) {
            let KO = Kx[KK];
            switch (KK) {
            case 'coins':
                Ky.push({
                    'src': gameAsset('./images/coins.png'),
                    'value': KO,
                    'type': 'coins'
                });
                break;
            case 'erthium':
                Ky.push({
                    'src': gameAsset('./images/erthium.png'),
                    'value': KO,
                    'type': 'erthium'
                });
                break;
            case 'gauntlets':
                Ky.push({
                    'src': gameAsset('./images/gauntlet.png'),
                    'value': KO,
                    'type': 'gauntlets'
                });
                break;
            case 'crates':
                for (let Ku in KO) {
                    let KW = KO[Ku];
                    Ky.push({
                        'src': gameAsset('./images/crates/' + Ku + '.png'),
                        'value': KW,
                        'type': 'crates'
                    });
                }
                break;
            case 'skins':
                for (let KB in KO) {
                    let Kl = KO[KB];
                    Ky.push({
                        'src': gameAsset('./images/skins/' + Kl + '.svg'),
                        'value': Kl,
                        'type': 'skins'
                    });
                }
                break;
            }
        }
        return Ky;
    }
    function I9(Kx) {
        let Ky = '';
        let KK = 0;
        let KO = I8(Kx);
        for (let Ku in KO) {
            let KW = KO[Ku].value;
            let KB = KO[Ku].type === 'skins' ? 'iconbig' : 'icon';
            Ky += KW + ('<img class="' + KB + '\x22 src=\x22' + KO[Ku].src + '"></img>');
            if (KK != Object.keys(Kx).length - 1)
                Ky += ' - ';
            KK++;
        }
        return Ky;
    }
    window.updateCampaignMissions = (function() {
        let Kx = null;
        let Ky = 0;
        let KK = Ky;
        let KO = KW => {
            let KB = '\x0a      <p class=\x22infobox\x22><b>Mission ' + (KW + 1) + '/' + Kx.length + ': </b> ' + Kx[KW].info + '</p>\x0a    <p><b>Rewards</b></p>\x0a      <div class=\x22infobox\x22 style=\x22display: flex; align-items: center;\x22>\x0a    \x0a    ';
            let Kl = I9(Kx[KW].rewards);
            i('missionInfo').innerHTML = KB + Kl + '</div>';
        }
        ;
        let Ku = async () => {
            if (Kx == null) {
                Kx = await gameAssetJSON('/shared/campaign.json');
            }
            Ky = Nq.account?.missions?.c1 ?? 0;
            KK = Ky;
            let KW = document.getElementById('missionCanvas');
            let KB = KW.getContext('2d');
            KB.fillStyle = '#d7d4c6';
            KB.strokeStyle = '#aba89c';
            KB.lineWidth = 2;
            KB.fillRect(20, 10, 1120, 50);
            KB.strokeRect(20, 10, 1120, 50);
            KB.fillStyle = '#a4d4e8';
            KB.fillRect(20, 10, 1120 * (Ky / Kx.length), 50);
            KB.fillStyle = '#aba89c';
            for (let Kl = 0; Kl < Kx.length; Kl++) {
                KB.fillRect(20 + 1120 / Kx.length * Kl, 10, 2, 50);
            }
            KB.drawImage(Nc['./images/xpbar.png'], 0, 0);
            KO(KK);
        }
        ;
        return {
            'down': () => {
                if (KK > 0)
                    KK--;
                i('missionInfo').style.opacity = 0;
                setTimeout( () => {
                    KO(KK);
                    i('missionInfo').style.opacity = 1;
                }
                , 300);
            }
            ,
            'up': () => {
                if (KK < Kx.length - 1)
                    KK++;
                i('missionInfo').style.opacity = 0;
                setTimeout( () => {
                    KO(KK);
                    i('missionInfo').style.opacity = 1;
                }
                , 300);
            }
            ,
            'update': Ku,
            'set': KO
        };
    }());
    async function II() {
        let Kx = await fetch(getAPIurl() + '/api/event');
        Kx = await Kx.text();
        const Ky = i('events');
        Ky.innerHTML = Kx;
        Array.from(Ky.querySelectorAll('script')).forEach(KK => {
            const KO = document.createElement('script');
            Array.from(KK.attributes).forEach(Ku => KO.setAttribute(Ku.name, Ku.value));
            KO.appendChild(document.createTextNode(KK.innerHTML));
            KK.parentNode.replaceChild(KO, KK);
        }
        );
    }
    var Ia = 100;
    var IG = 90;
    class Ii {
        constructor(Kx, Ky, KK) {
            this.x = Kx * Ia;
            this.y = Ky * IG;
            this.type = KK;
            this.flowers = [];
            this.top = 1;
            this.light = !![];
            this.cave = ![];
        }
        ['draw'](Kx, Ky, KK, KO) {
            this.drawFlowersOld(Kx, Ky, KK, KO);
        }
        ['render']() {}
        ['distanceCheck'](Kx) {
            return Math.abs(this.x - Kx.x) > NQ.width / 2 + Ia || Math.abs(this.y - Kx.y) > NQ.height / 2 + IG;
        }
        ['drawFlowers'](Kx, Ky, KK) {
            return;
            for (let KO in this.flowers) {
                if (this.flowers[KO].t == 0)
                    continue;
                Kx.translate(Ky + this.flowers[KO].off * 10, KK - 17);
                let Ku = this.flowers[KO].sf;
                Kx.scale((this.flowers[KO].f * 2 - 1) * Ku, Ku);
                let KW = (this.flowers[KO].t - 1) % 6 * 50;
                let KB = Math.floor((this.flowers[KO].t - 1) / 6) * 50;
                Kx.drawImage(Nc['./images/flowers.png'], KW, KB, 50, 50, -15, 0, 30, 30);
                Kx.resetTransform();
            }
        }
        ['goThru']() {
            return !![];
        }
        ['drawFlowersOld'](Kx, Ky, KK, KO) {
            for (let Ku in this.flowers) {
                if (this.flowers[Ku].t == 0)
                    continue;
                let KW = Ny(this.x + this.flowers[Ku].off * 10, this.y - 17, KK, KO);
                let KB = this.flowers[Ku].sf;
                let Kl = (this.flowers[Ku].t - 1) % 6 * 50;
                let Ks = Math.floor((this.flowers[Ku].t - 1) / 6) * 50;
                let KZ = (this.flowers[Ku].f * 2 - 1) * KB * KO;
                NM.drawImage(Nc['./images/flowers.png'], Kl, Ks, 50, 50, -15 * KZ + KW.x, KW.y, 30 * KZ, 30 * KB * KO);
            }
        }
    }
    class IN extends Ii {
        constructor() {
            super(...arguments);
            this.light = !![];
        }
    }
    class Ix extends IN {
        constructor(Kx) {
            super(...arguments);
            this.src = Nq.tilesrcs[this.type];
            ;this.tree = !![];
            Nq.trees.push(this);
        }
        ['draw'](Kx, Ky, KK) {
            NM.drawImage(Nc[this.src], this.x + Ia / 2 - Nc[this.src].width / 2 + Kx, this.y + IG - Nc[this.src].height + Ky + 20);
        }
    }
    class Iy extends IN {
        constructor() {
            super(...arguments);
            this.src = Nq.tilesrcs[this.type];
            this.light = !![];
            this.cave = !![];
        }
        ['draw'](Kx, Ky, KK) {
            return;
            if (!Nq.settings.highdetail && ![]) {
                NM.fillStyle = '#005e00';
                NM.fillRect(this.x + Kx, this.y + Ky, Ia, IG);
            } else {
                NM.drawImage(Nc.tiles, 100 * (this.type % 20), 180 * Math.floor(this.type / 20) + 90, 100, 90, this.x + Kx, this.y + Ky, 100, 90);
            }
        }
        ['render'](Kx, Ky, KK) {
            Kx.drawImage(Nc.tiles, 100 * (this.type % 20), 180 * Math.floor(this.type / 20) + 90, 100, 90, Ky, KK, 100, 90);
        }
    }
    class IK extends Ii {
        constructor() {
            super(...arguments);
            this.src = './images/snow_tiles1.png';
        }
        ['draw'](Kx, Ky, KK) {
            if (this.distanceCheck(KK))
                return;
            NM.fillStyle = 'rgba(0, 0, 0, 0.5)';
            let KO = 0;
            let Ku = 2;
            NP.clearRect((this.x + Kx - 10) / Ku + KO, (this.y + Ky - 10) / Ku + KO, 120 / Ku, 100 / Ku);
            NP.fillStyle = 'rgba(247, 123, 0, 0.3)';
            NP.fillRect((this.x + Kx - 10) / Ku + KO, (this.y + Ky - 10) / Ku + KO, 120 / Ku, 100 / Ku);
            if (!Nq.settings.highdetail) {
                NM.fillStyle = '#FFFF00';
            } else {
                NM.drawImage(Nc[this.src], 100, 90, 100, 90, this.x + Kx, this.y + Ky, 100, 90);
            }
            NM.fillRect(this.x + Kx, this.y + Ky, Ia, IG);
            NM.fillStyle = '#ffa202';
            if (this.sY != 0) {
                NM.fillStyle = '#ff8d02';
                NM.fillRect(this.x + Kx, this.y + Ky, Ia, IG);
                return;
            }
            NM.beginPath();
            NM.moveTo(this.x + Kx, this.y + Ky + 10);
            for (let KW = 0; KW <= 20; KW++) {
                NM.lineTo(this.x + Kx + 100 / 20 * KW, this.y + Ky + 2 * (Math.sin(Nq.GAME_TICK / 30) + 1) * Math.sin(2 * Math.PI / 20 * KW + Nq.GAME_TICK / 40) + 10);
            }
            NM.lineTo(this.x + Kx + 100, this.y + Ky + 90);
            NM.lineTo(this.x + Kx, this.y + 90 + Ky);
            NM.closePath();
            NM.fill();
            NM.fillStyle = '#ff8d02';
            NM.beginPath();
            NM.moveTo(this.x + Kx, this.y + Ky + 30);
            for (let KB = 0; KB <= 20; KB++) {
                NM.lineTo(this.x + Kx + 100 / 20 * KB, this.y + Ky + 2 * (Math.sin(Nq.GAME_TICK / 30) + 1) * Math.sin(2 * Math.PI / 20 * KB + Nq.GAME_TICK / 30) + 30);
            }
            NM.lineTo(this.x + Kx + 100, this.y + Ky + 90);
            NM.lineTo(this.x + Kx, this.y + 90 + Ky);
            NM.closePath();
            NM.fill();
            NM.strokeStyle = '#ffd884';
            NM.lineWidth = 3;
            NM.beginPath();
            NM.moveTo(this.x + Kx, this.y + Ky + 30);
            for (let Kl = 0; Kl <= 20; Kl++) {
                NM.lineTo(this.x + Kx + 100 / 20 * Kl, this.y + Ky + 2 * (Math.sin(Nq.GAME_TICK / 30) + 1) * Math.sin(2 * Math.PI / 20 * Kl + Nq.GAME_TICK / 30) + 30);
            }
            NM.stroke();
            NM.beginPath();
            NM.moveTo(this.x + Kx, this.y + Ky + 10);
            for (let Ks = 0; Ks <= 20; Ks++) {
                NM.lineTo(this.x + Kx + 100 / 20 * Ks, this.y + Ky + 2 * (Math.sin(Nq.GAME_TICK / 30) + 1) * Math.sin(2 * Math.PI / 20 * Ks + Nq.GAME_TICK / 40) + 10);
            }
            NM.stroke();
        }
    }
    class IO extends Ii {
        constructor(Kx, Ky, KK, KO) {
            super(Kx, Ky, KK);
            this.sX = 0;
            this.sY = 0;
            this.h = 10;
            this.light = ![];
            this.biome = KO;
            this.src = Nq.tilesrcs.X;
        }
        ['goThru']() {
            return ![];
        }
        ['render'](Kx, Ky, KK, KO=!![]) {
            Kx.drawImage(Nc.tiles, 100 * (this.type % 20), 180 * Math.floor(this.type / 20) + 1 * 90, 100, 90, Ky, KK, 100, 90);
            let Ku = Nq.tileIndex[this.type];
            if (Ku.overlay.src == 'border') {
                let KW = Ku.overlay.filter[0];
                let KB = Ku.overlay.filter[1];
                Kx.globalAlpha = KB;
                if (this.sY >= 180) {
                    iV(Ky + 50, KK + 45, Math.PI, 1, 1, Kx);
                    Kx.drawImage(Nc.tiles, 100 * (KW % 20), 180 * Math.floor(KW / 20) + 30, 100, 90 - 30, -50, -45, 100, 90);
                }
                if (this.sX == 0 || this.sX == 300) {
                    iV(Ky + 50, KK + 45, Math.PI / 2, 1, 1, Kx);
                    Kx.drawImage(Nc.tiles, 100 * (KW % 20), 180 * Math.floor(KW / 20) + 30, 100, 90 - 30, -45, -50, 90, 100);
                }
                if (this.sX == 200 || this.sX == 300) {
                    iV(Ky + 50, KK + 45, Math.PI / 2 * 3, 1, 1, Kx);
                    Kx.drawImage(Nc.tiles, 100 * (KW % 20), 180 * Math.floor(KW / 20) + 30, 100, 90 - 30, -45, -50, 90, 100);
                }
                Kx.resetTransform();
                Kx.globalAlpha = 1;
            }
            if (!this.top)
                Kx.drawImage(Nc.tiles, 100 * (this.type % 20), 180 * Math.floor(this.type / 20) + this.top * 90, 100, 90, Ky, KK, 100, 90);
            if (KO) {
                for (let Kl = 0; Kl < 2; Kl++)
                    Kx.drawImage(Nc['./images/borders.png'], this.sX, this.sY, 100, 90, Ky, KK, 100, 90);
            }
        }
    }
    class Iu extends Ii {
        constructor() {
            super(...arguments);
            this.light = !![];
            this.liquid = !![];
        }
        ['render']() {}
        ['draw'](Kx, Ky, KK, KO) {
            let Ku = Ny(this.x, this.y, KK, KO);
            let KW = Ku.x;
            let KB = Ku.y;
            let Kl = Ia * KO;
            let Ks = NM.lineWidth;
            NM.fillStyle = 'rgba(0, 0, 0, 0.5)';
            let KZ = 0;
            let Kp = 2;
            if (!Nq.settings.highdetail) {
                NM.fillStyle = '#FFFF00';
            } else {}
            NM.globalAlpha = Nq.tileIndex[this.type].data?.viscocity ?? 0.3;
            let Kh = Nq.biome.current;
            let Kg = Nq.tileIndex[this.type].bottom.filter[0];
            if (Nq.tileIndex[this.type].bottom.filter[1] == 'biome') {
                Kg = o[Kh]?.water ?? '#0000FF';
            }
            let Kr = Nq.tileIndex[this.type].biome;
            if (Nq.tileIndex[this.type].bottom.filter[1] == 'depth') {
                let Kv = (KK.y - 4930) / (10950 - 4930);
                Kv = x0(Kv, 0, 1);
                let Ke = o[Kr];
                let KL = Math.floor(Ke.waterSurface.r * (1 - Kv) + Ke.waterDeep.r * Kv).toString(16);
                let KS = Math.floor(Ke.waterSurface.g * (1 - Kv) + Ke.waterDeep.g * Kv).toString(16);
                let KA = Math.floor(Ke.waterSurface.b * (1 - Kv) + Ke.waterDeep.b * Kv).toString(16);
                if (KL.length == 1)
                    KL = '0' + KL;
                if (KS.length == 1)
                    KS = '0' + KS;
                if (KA.length == 1)
                    KA = '0' + KA;
                Kg = '#' + KL + KS + KA;
            }
            let KD = Kg;
            let KQ = ir(KD, -20);
            let KM = iD(ir(KD, -40));
            NM.fillStyle = KD;
            let KY = IG;
            if (Nq.map[(this.y / IG + 1) * Nq.mapwidth + this.x / Ia] instanceof IO)
                KY += 30;
            let KX = KY * KO;
            let KE = 2 * (Math.sin(Nq.GAME_TICK / 30) + 1) * KO;
            if (this.sY != 0) {
                NM.fillRect(KW, KB, Kl, KX);
                NM.fillStyle = KD;
                NM.fillRect(KW, KB, Kl, KX);
                NM.globalAlpha = 1;
                NM.lineWidth = Ks;
                return;
            }
            NM.fillStyle = KQ;
            NM.beginPath();
            NM.moveTo(KW, KB + 10 * KO);
            for (let Kk = 0; Kk <= 20; Kk++) {
                NM.lineTo(KW + Kl / 20 * Kk, KB + KE * Math.sin(2 * Math.PI / 20 * Kk + Nq.GAME_TICK / 40) + 10 * KO);
            }
            NM.lineTo(KW + Kl, KB + KX);
            NM.lineTo(KW, KB + KX);
            NM.closePath();
            NM.fill();
            NM.fillStyle = KD;
            NM.beginPath();
            NM.moveTo(KW, KB + 30 * KO);
            for (let Ko = 0; Ko <= 20; Ko++) {
                NM.lineTo(KW + Kl / 20 * Ko, KB + KE * Math.sin(2 * Math.PI / 20 * Ko + Nq.GAME_TICK / 30) + 30 * KO);
            }
            NM.lineTo(KW + Kl, KB + KX);
            NM.lineTo(KW, KB + KX);
            NM.closePath();
            NM.fill();
            NM.strokeStyle = KM;
            NM.lineWidth = 3 * KO;
            NM.beginPath();
            NM.moveTo(KW, KB + 30 * KO);
            for (let KT = 0; KT <= 20; KT++) {
                NM.lineTo(KW + Kl / 20 * KT, KB + KE * Math.sin(2 * Math.PI / 20 * KT + Nq.GAME_TICK / 30) + 30 * KO);
            }
            NM.stroke();
            NM.beginPath();
            NM.moveTo(KW, KB + 10 * KO);
            for (let KJ = 0; KJ <= 20; KJ++) {
                NM.lineTo(KW + Kl / 20 * KJ, KB + KE * Math.sin(2 * Math.PI / 20 * KJ + Nq.GAME_TICK / 40) + 10 * KO);
            }
            NM.stroke();
            NM.lineWidth = Ks;
            NM.globalAlpha = 1;
        }
    }
    let IW = {
        'grass': [[110, 0, 125, 85], [100, 87, 155, 98], [40, 70, 60, 40]],
        'snow': [[235, 0, 125, 85], [255, 87, 155, 98], [43, 115, 60, 40]],
        'cave': [[0, 195, 170, 390 - 195], [175, 190, 270 - 175, 250 - 190], [270, 190, 312 - 270, 230 - 190]]
    };
    class IB {
        constructor(Kx, Ky, KK, KO) {
            this.x = Kx;
            this.y = Ky;
            this.sX = IW[KO][KK][0];
            this.sY = IW[KO][KK][1];
            this.sW = IW[KO][KK][2];
            this.sH = IW[KO][KK][3];
        }
        ['draw'](Kx, Ky) {
            NM.drawImage(Nc['./images/weapons.png'], this.sX, this.sY, this.sW, this.sH, this.x + Kx - this.sW / 2, this.y + Ky - this.sH + 12, this.sW, this.sH);
        }
    }
    const Il = [[0, 0, 256, 128, !![], 3, 'bush1'], [256, 0, 256, 128, !![], 3, 'bush2'], [0, 128, 256, 128, !![], 3, 'bush3'], [256, 256, 128, 128, !![], 2, 'root'], [256, 128, 128, 128, !![], 3, 'thing'], [0, 384, 256, 128, !![], 3, 'flower bush '], [255, 386, 55, 126, !![], 3, 'yellow flower'], [310, 387, 77, 72, !![], 3, 'purple flower'], [408, 393, 85, 116, !![], 3, 'dyellow'], [388, 131, 123, 58, !![], 3, 'vineb'], [385, 195, 125, 62, !![], 3, 'plont'], [386, 320, 29, 63, !![], 3, 'pflower'], [420, 332, 32, 51, !![], 3, 'greflower'], [451, 261, 25, 122, !![], 3, 'wheat'], [513, 0, 60, 316, !![], 3, 'vinebig'], [588, 0, 37, 193, !![], 3, 'vinesmall'], [512, 327, 126, 57, !![], 3, 'fernbush'], [511, 386, 159, 100, !![], 3, 'ogbush'], [584, 205, 45, 45, !![], 3, 'mushroomclump'], [570, 254, 71, 38, !![], 3, 'wall fungus big'], [586, 293, 56, 25, !![], 3, 'wall fungus small'], [642, 303, 61, 50, !![], 2, 'default grass'], [655, 6, 94, 67, !![], 3, 'mushroom clump big'], [643, 75, 60, 53, !![], 3, 'tiny bush,'], [641, 129, 108, 78, !![], 3, 'dirt rock big'], [643, 208, 93, 47, !![], 3, 'dirt rock small'], [641, 259, 105, 43, !![], 3, 'dirt rock botom'], [772, 5, 109, 100, !![], 3, 'truss'], [763, 112, 138, 129, !![], 3, 'watchtower'], [707, 300, 56, 52, !![], 2, 'crate'], [666, 389, 48, 59, !![], 2, 'barrel'], [667, 451, 75, 39, !![], 3, 'anvil'], [883, 0, 195, 81, !![], 2, 'tent'], [764, 241, 194, 266, !![], 3, 'support'], [902, 85, 64, 47, !![], 3, 'dry grass clump'], [0, 515, 445, 285, !![], 3, 'weird tree thing'], [440, 513, 93, 102, !![], 3, 'wavy root'], [537, 487, 63, 54, !![], 3, 'dry red blub'], [456, 620, 45, 69, !![], 3, 'red wavy flower'], [17, 261, 219, 122, !![], 3, 'dry bush'], [0, 819, 493, 445, !![], 3, 'dry tree'], [540, 552, 70, 15, !![], 3, 'moss'], [552, 568, 47, 50, !![], 3, 'curly leaf thing'], [619, 519, 186, 112, !![], 3, 'holly bush'], [814, 517, 44, 90, !![], 3, 'purpl flower'], [869, 512, 20, 80, !![], 3, 'chain'], [512, 622, 18, 58, !![], 3, 'red thing'], [0, 1261, 374, 643, !![], 3, 'tree'], [553, 625, 52, 54, !![], 3, 'red thing clump'], [620, 644, 220, 122, !![], 3, 'apline bush'], [626, 780, 71, 26, !![], 3, 'leaf carpet'], [966, 85, 64, 47, !![], 3, 'alpine gras'], [498, 691, 126, 154, !![], 3, 'statue'], [1874, 0, 174, 295, !![], 1, 'dirtwall(bg)'], [504, 941, 158, 94, !![], 3, 'brickwall'], [506, 847, 156, 92, !![], 1, 'bricks,'], [660, 849, 67, 30, !![], 3, 'brick'], [665, 881, 60, 95, !![], 3, 'vase'], [378, 1272, 134, 279, !![], 3, 'tallredplantthing'], [505, 1036, 117, 132, !![], 2, 'gnome house'], [519, 1172, 346, 543, !![], 3, 'tree pine'], [875, 1177, 333, 537, !![], 3, 'snow tree'], [965, 136, 99, 79, !![], 3, 'snoworkc1'], [962, 217, 95, 43, !![], 3, 'snowrock2'], [966, 274, 211, 123, !![], 3, 'swnobush'], [968, 400, 42, 184, !![], 3, 'icicle'], [1066, 129, 113, 127, !![], 3, 'snowthin'], [1033, 92, 49, 32, !![], 3, 'stick cover'], [1185, 152, 173, 102, !![], 3, 'bare bush 1,'], [1185, 51, 170, 100, !![], 3, 'bare bush snow'], [1013, 399, 80, 222, !![], 3, 'big icicle'], [1947, 1976, 101, 72, !![], 3, 'wires'], [1924, 1891, 24, 157, !![], 3, 'metal rod'], [1955, 1928, 93, 48, !![], 3, 'pipe 1/2'], [1951, 1832, 97, 96, !![], 3, 'pipe 1/4'], [1994, 1806, 54, 26, !![], 3, 'blue lamp'], [1950, 1751, 98, 53, !![], 2, 'blue display'], [1835, 1803, 87, 108, !![], 3, 'vat'], [1811, 1917, 109, 21, !![], 3, 'light'], [1820, 1938, 102, 69, !![], 2, 'metal panel'], [1821, 2010, 100, 38, !![], 2, 'panel'], [1748, 1934, 60, 91, !![], 3, 'pipe straight'], [1750, 2027, 57, 19, !![], 3, 'pipe connector'], [703, 773, 170, 55, !![], 1, 'grass clump'], [893, 514, 34, 71, !![], 3, 'tall rock'], [878, 660, 67, 170, !![], 3, 'alpine stalagmite'], [1985, 1686, 61, 62, !![], 3, 'hanging cables'], [1659, 1851, 80, 197, !![], 2, 'round metal piece'], [1743, 1856, 91, 54, !![], 2, 'desk'], [1889, 1740, 59, 65, !![], 2, 'canisters'], [1854, 1741, 36, 63, !![], 2, 'control panel'], [1805, 1745, 48, 58, !![], 3, 'server'], [958, 632, 142, 71, !![], 3, 'log'], [1229, 1187, 341, 535, !![], 3, 'green pine'], [662, 988, 180, 91, !![], 3, 'purple plant'], [925, 840, 79, 283, !![], 3, 'purple stem'], [852, 842, 62, 217, !![], 2, 'goo'], [732, 843, 115, 97, !![], 3, 'alter'], [1021, 835, 84, 134, !![], 3, 'purple cyst'], [961, 719, 88, 45, !![], 3, 'leaf cover'], [1099, 397, 140, 176, !![], 3, 'fern'], [1112, 631, 38, 186, !![], 3, 'lava stalactite s'], [1155, 629, 80, 227, !![], 3, 'lava stalactite l'], [1236, 628, 108, 79, !![], 3, 'stone rock'], [1236, 708, 100, 47, !![], 3, 'stone roc, s'], [1347, 626, 102, 277, !![], 3, 'stalactite steps'], [1024, 976, 61, 81, !![], 3, 'torch'], [1024, 1055, 61, 53, !![], 3, 'lantern'], [1115, 857, 174, 197, !![], 3, 'big shroom'], [1935, 737, 113, 78, !![], 2, '100w90h dirt'], [1736, 737, 194, 64, !![], 2, '200w70h dirt'], [1754, 640, 294, 91, !![], 2, '300w90h dirt'], [1853, 481, 195, 158, !![], 2, '200w160h dirt'], [1669, 299, 375, 167, !![], 2, '375w180h dirt'], [1370, 0, 140, 222, !![], 2, 'portal'], [87, 147, 46, 126, !![], 3, 'sabre-weapon', './images/weapons.png'], [0, 0, 960, 275, !![], 2, 'realmz.io', './images/realmz.png'], [1294, 903, 83, 118, !![], 3, 'gourd-yellow'], [1389, 909, 88, 108, !![], 3, 'grourd-white'], [1483, 925, 108, 88, !![], 3, 'gourd-orange'], [407, 1552, 104, 34, !![], 2, 'leaf debris'], [1450, 624, 290, 152, !![], 3, 'snoot statue'], [1450, 780, 138, 128, !![], 3, 'conuran statue'], [1586, 778, 106, 122, !![], 3, 'fps statue'], [1596, 900, 114, 36, !![], 3, 'pedestal'], [1511, 0, 102, 144, !![], 3, 'wavy roots2'], [1617, 3, 110, 51, !![], 3, 'leave plants'], [1625, 68, 196, 33, !![], 2, 'falen leaves'], [1082, 4, 61, 46, !![], 3, 'graveyard grass'], [1353, 225, 130, 100, !![], 3, 'gravegrass big'], [1177, 258, 171, 118, !![], 3, 'brown shrooms'], [1320, 411, 233, 173, !![], 3, 'jungle flower'], [1826, 630, 100, 82, !![], 3, 'dark rock 1'], [1831, 714, 90, 43, !![], 3, 'dark rock 2'], [1823, 764, 132, 139, !![], 3, 'grave1'], [1955, 795, 91, 106, !![], 3, 'grave2'], [1718, 1120, 288, 557, !![], 3, 'grave tree'], [6, 1909, 484, 362, !![], 3, 'savanna tree'], [498, 1722, 370, 518, !![], 3, 'jungle tree'], [1241, 430, 72, 140, !![], 3, 'sunflower'], [1527, 154, 36, 150, !![], 3, 'corn'], [1220, 1055, 478, 654, !![], 3, 'connifertop'], [1933, 302, 114, 459, !![], 3, 'bigtrunk'], [2052, 0, 92, 92, !![], 3, 'spike1'], [2165, 4, 92, 92, !![], 3, 'spike2'], [2262, 3, 100, 96, !![], 3, 'spike3'], [2050, 108, 190, 218, !![], 3, 'crimsonplant'], [2065, 855, 128, 52, !![], 2, 'darkbricks'], [2063, 907, 68, 102, !![], 2, 'brickpillar'], [2134, 907, 72, 102, !![], 2, 'brickpillar2'], [2062, 1011, 121, 32, !![], 2, 'pillarbase'], [2207, 854, 106, 52, !![], 3, 'hangingflesh'], [2208, 910, 40, 100, !![], 3, 'hangingflesh2'], [2077, 1718, 54, 100, !![], 3, 'brassvat'], [2084, 1827, 30, 34, !![], 3, 'bulb'], [2132, 1718, 29, 29, !![], 3, 'valve'], [2161, 1710, 20, 38, !![], 3, 'brassvatsmall'], [2181, 1710, 34, 12, !![], 3, 'brass horizontal'], [2133, 1750, 50, 50, !![], 3, 'conductor'], [2187, 1783, 34, 36, !![], 2, 'books'], [2186, 1727, 102, 56, !![], 2, 'whiteboard'], [2289, 1735, 50, 48, !![], 3, 'heater'], [2160, 1802, 20, 30, !![], 3, 'valveside'], [2133, 1802, 26, 26, !![], 3, 'brasspipe bent'], [2131, 1827, 18, 56, !![], 3, 'brasspipe'], [2080, 1885, 142, 82, !![], 2, 'couch'], [2224, 1904, 106, 52, !![], 2, 'table'], [2245, 908, 102, 52, !![], 3, 'hangingflesh3'], [2253, 967, 94, 84, !![], 3, 'flesh4'], [2219, 1785, 150, 82, !![], 2, 'whiteboardlarge'], [2080, 1963, 114, 114, !![], 3, 'gear1'], [2194, 1963, 168, 168, !![], 3, 'gear2'], [2015, 2078, 178, 120, !![], 2, 'steamengine'], [2198, 2134, 160, 160, !![], 2, 'fan'], [2129, 2200, 62, 62, !![], 2, 'painting1'], [2042, 2201, 84, 64, !![], 2, 'painting2'], [1981, 2198, 60, 108, !![], 2, 'painting3'], [2259, 99, 111, 122, !![], 2, 'grunge1'], [2376, 100, 121, 63, !![], 2, 'grunge2'], [2379, 176, 41, 110, !![], 2, 'grunge3'], [2420, 173, 79, 61, !![], 2, 'grunge4'], [2424, 242, 76, 34, !![], 2, 'grunge5'], [2391, 1775, 108, 96, !![], 2, 'window1'], [2392, 1871, 108, 96, !![], 2, 'window2'], [2008, 1116, 318, 558, !![], 3, 'poplar tree'], [2043, 2266, 96, 62, !![], 3, 'inductor coil'], [2391, 1969, 82, 78, !![], 2, 'arrow sign'], [1822, 2050, 142, 202, !![], 3, 'giant vat'], [1968, 2055, 46, 96, !![], 3, 'brass bars'], [1570, 151, 21, 58, !![], 3, 'small jungle vine'], [1593, 149, 35, 145, !![], 2, 'jungle vine'], [884, 1734, 482, 514, !![], 3, 'jungle tree'], [0, 2341, 130, 160, !![], 3, 'tube coral'], [130, 2392, 176, 108, !![], 3, 'coral'], [307, 2337, 204, 164, !![], 3, 'fan coral'], [515, 2354, 128, 156, !![], 3, 'blob coral'], [642, 2354, 148, 146, !![], 3, 'big anemone'], [791, 2411, 92, 88, !![], 3, 'small anemone'], [884, 2374, 172, 126, !![], 3, 'weird anemoone'], [1057, 2430, 147, 65, !![], 2, 'big barnacles'], [1205, 2470, 58, 32, !![], 2, 'small barnacles'], [0, 0, 137, 125, !![], 3, 'prickly pear', './images/propsmap2.png'], [0, 147, 175, 101, !![], 3, 'dry bush', './images/propsmap2.png'], [0, 256, 125, 155, !![], 3, 'cactus', './images/propsmap2.png'], [204, 0, 45, 31, !![], 3, 'cactus flower', './images/propsmap2.png'], [183, 43, 89, 101, !![], 3, 'ball cacti', './images/propsmap2.png'], [183, 164, 100, 81, !![], 3, 'sand rock', './images/propsmap2.png'], [180, 250, 90, 45, !![], 3, 'tiny sand rock', './images/propsmap2.png'], [296, 3, 134, 353, !![], 3, 'tall cactus', './images/propsmap2.png'], [0, 423, 142, 128, !![], 3, 'bull skull', './images/propsmap2.png'], [166, 317, 44, 187, !![], 3, 'desert stalactite s', './images/propsmap2.png'], [210, 317, 82, 223, !![], 3, 'desert stalactite l', './images/propsmap2.png'], [0, 565, 113, 279, !![], 3, 'desert stalactite steps', './images/propsmap2.png'], [140, 570, 100, 85, !![], 3, 'fossil rock', './images/propsmap2.png'], [137, 657, 93, 44, !![], 3, 'small fossil rock', './images/propsmap2.png'], [306, 400, 100, 85, !![], 3, 'enchanted rock', './images/propsmap2.png'], [306, 482, 93, 44, !![], 3, 'small enchanted rock', './images/propsmap2.png'], [440, 0, 348, 516, !![], 3, 'enchanted tree', './images/propsmap2.png'], [785, 12, 210, 128, !![], 3, 'enchanted bush', './images/propsmap2.png'], [1010, 30, 142, 85, !![], 3, 'enchanted log', './images/propsmap2.png'], [1157, 48, 61, 50, !![], 3, 'enchanted grass', './images/propsmap2.png'], [800, 160, 85, 195, !![], 3, 'enchanted flower', './images/propsmap2.png'], [885, 159, 185, 212, !![], 3, 'enchanted vines', './images/propsmap2.png'], [1070, 178, 104, 198, !![], 3, 'enchanted mushroom', './images/propsmap2.png'], [460, 525, 200, 265, !![], 3, 'enchantned corn', './images/propsmap2.png'], [270, 570, 168, 195, !![], 3, 'tall brown mushroom', './images/propsmap2.png'], [370, 789, 70, 60, !![], 3, 'skull', './images/propsmap2.png'], [0, 858, 160, 185, !![], 2, 'anthill', './images/propsmap2.png'], [0, 1060, 278, 442, !![], 3, 'old alpine tree', './images/propsmap2.png'], [160, 790, 210, 128, !![], 3, 'old alpine bush', './images/propsmap2.png'], [377, 858, 61, 50, !![], 3, 'old alpine grass', './images/propsmap2.png'], [505, 832, 100, 85, !![], 3, 'lichen rock', './images/propsmap2.png'], [502, 917, 93, 44, !![], 3, 'small lichen fossil rock', './images/propsmap2.png'], [292, 925, 210, 128, !![], 3, 'tropical grassland bush', './images/propsmap2.png'], [437, 858, 61, 50, !![], 3, 'tropical grassland grass', './images/propsmap2.png'], [1221, 0, 354, 509, !![], 3, 'palm tree', './images/propsmap2.png'], [1582, 0, 120, 135, !![], 3, 'sandcastle', './images/propsmap2.png'], [1582, 136, 155, 184, !![], 3, 'beach bulb', './images/propsmap2.png'], [1620, 325, 75, 119, !![], 3, 'beach grass', './images/propsmap2.png'], [1738, 0, 173, 205, !![], 3, 'tube worms', './images/propsmap2.png']];
    const Is = {
        76: !![]
    };
    function IZ(Kx) {
        return {
            'x': 4 * Math.sin(Kx.x / 10) - 2 * Math.cos(Kx.x / 4),
            'y': 4 * Math.cos(Kx.y / 10) + 2 * Math.sin(Kx.y / 4)
        };
    }
    const Ip = {
        'width': 5,
        'height': 5,
        'data': [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        'x': Kx => {
            return Kx % Nq.mapwidth;
        }
        ,
        'y': Kx => {
            return Math.floor(Kx / Nq.mapheight);
        }
        ,
        'i': Kx => {
            return Math.floor(Kx.y) * Nq.mapwidth + Math.floor(Kx.x);
        }
        ,
        'i2': Kx => {
            return Math.floor(Kx.y / 90) * Nq.mapwidth + Math.floor(Kx.x / 100);
        }
    };
    function Ih(Kx, Ky, KK, KO, Ku) {
        if (Kx == 0)
            return;
        let KW = [];
        let KB = 8;
        for (let Kl = 0; Kl < KB; Kl++) {
            let Ks = {
                'x': Ip.x(Ky) * 100 + Kl * 100 / KB - KO,
                'y': Ip.y(Ky) * 90 - Ku
            };
            let KZ = IZ(Ks);
            Ks.y += KZ.x;
            Ks.x += KZ.y;
            KW.push(Ks);
        }
        for (let Kp = 0; Kp < KB; Kp++) {
            let Kh = {
                'x': Ip.x(Ky) * 100 + 100 - KO,
                'y': Ip.y(Ky) * 90 + Kp * 90 / KB - Ku
            };
            let Kg = IZ(Kh);
            Kh.y += Kg.x;
            Kh.x += Kg.y;
            KW.push(Kh);
        }
        for (let Kr = 0; Kr < KB; Kr++) {
            let KD = {
                'x': Ip.x(Ky) * 100 + 100 - Kr * 100 / KB - KO,
                'y': Ip.y(Ky) * 90 + 90 - Ku
            };
            let KQ = IZ(KD);
            KD.y += KQ.x;
            KD.x += KQ.y;
            KW.push(KD);
        }
        for (let KM = 0; KM < KB; KM++) {
            let KY = {
                'x': Ip.x(Ky) * 100 - KO,
                'y': Ip.y(Ky) * 90 + 90 - KM * 90 / KB - Ku
            };
            let KX = IZ(KY);
            KY.y += KX.x;
            KY.x += KX.y;
            KW.push(KY);
        }
        for (let KE in KK) {
            let Kv = KK[KE];
            for (let Ke in KW) {
                let KL = Math.hypot(Kv.x - KW[Ke].x, Kv.y - KW[Ke].y) ** 2 / 1000;
                let KS = Kv.dir;
                let KA = 12;
                let Kk = -2 * Math.cos(KS) / KL;
                if (Math.abs(Kk) > KA)
                    Kk = KA * Math.sign(Kk);
                let Ko = -2 * Math.sin(KS) / KL;
                if (Math.abs(Ko) > KA)
                    Ko = KA * Math.sign(Ko);
                KW[Ke].x += Kk;
                KW[Ke].y += Ko;
            }
        }
        KW.push(KW[0]);
        KW.unshift({
            'x': Ip.x(Ky) * 100 + 50 - KO,
            'y': Ip.y(Ky) * 90 + 45 - Ku
        });
        return KW;
    }
    function Ig(Kx, Ky) {
        Kx.beginPath();
        Kx.moveTo(Ky[0].x, Ky[0].y);
        for (let KK = 1; KK < Ky.length; KK++) {
            Kx.lineTo(Ky[KK].x, Ky[KK].y);
        }
        Kx.lineTo(Ky[0].x, Ky[0].y);
        Kx.closePath();
        Kx.stroke();
    }
    let Ir = 'varying highp vec2 vTextureCoord;\n  uniform sampler2D uSampler;\n  uniform highp int uTime;\n  uniform highp vec2 uResolution;\n\n  highp vec2 random(highp vec2 st) {\n    st = vec2( dot(st,vec2(127.1,311.7)),dot(st,vec2(269.5,183.3)));\n    return -1.0 + 2.0*fract(sin(st)*43758.5453123);\n  }\n\n  highp float noise(highp vec2 st) {\n    highp vec2 i = floor(st);\n    highp vec2 f = fract(st);\n    highp vec2 u = f*f*(3.0-2.0*f);\n    return mix( mix( dot( random(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),\n                     dot( random(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),\n                mix( dot( random(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),\n                     dot( random(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);\n }\n  \n  void main() {\n    gl_FragColor = vec4(147.0/255.0, 142.0/255.0, 125.0/255.0, 1.0);\n//rgb(147, 142, 125)\n    //highp vec2 st = gl_FragCoord.xy/uResolution.xy;\n\n    //highp float n = clamp(noise(st*25.0)*0.3+1.0, 0.0, 1.0);\n\n    //gl_FragColor = texture2D(uSampler, vec2(gl_FragCoord.x/100.0, gl_FragCoord.y/90.0))*vec4(n, n, n, 1.0)*vec4(154.0/255.0, 143.0/255.0, 122.0/255.0, 1.0);\n    // gl_FragColor = vec4(1.0*n, 0.0, 0.0, 1.0); \n  }';
    let ID = 'attribute vec2 aVertexPosition;\n  // attribute vec4 aVertexColor;\n  attribute vec2 aTextureCoord;\n  \n  uniform mat3 uModelViewMatrix;\n  uniform mat3 uProjectionMatrix;\n  uniform vec2 uResolution;\n  uniform mat3 uTextureMatrix;\n  \n  \n  varying highp vec2 vTextureCoord;\n  \n  void main() {\n    vec2 position = (uProjectionMatrix * uModelViewMatrix * vec3(aVertexPosition, 1.0)).xy;\n  \n    position /= uResolution;\n  \n    vec2 conversion = position * 2.0;\n  \n    vec2 clipSpace = conversion - 1.0;\n    \n    vTextureCoord = aTextureCoord; \n    gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);\n    \n    //(uTextureMatrix * vec3(aTextureCoord, 0)).xy;\n    \n    // vColor = aVertexColor;\n  }';
    function IQ(Kx) {
        let Ky = new OffscreenCanvas(700,540);
        let KK = Ky.getContext('webgl2');
        KK.clearColor(0, 0, 0, 0);
        KK.clear(KK.COLOR_BUFFER_BIT);
        KK.pixelStorei(KK.UNPACK_FLIP_Y_WEBGL, !![]);
        KK.pixelStorei(KK.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !![]);
        for (let KO in Kx.shaders) {
            const Ku = initShaderProgram(KK, ID, Ir);
            const KW = {
                'program': Ku,
                'attribLocations': {
                    'vertexPosition': KK.getAttribLocation(Ku, 'aVertexPosition')
                },
                'uniformLocations': {
                    'projectionMatrix': KK.getUniformLocation(Ku, 'uProjectionMatrix'),
                    'modelViewMatrix': KK.getUniformLocation(Ku, 'uModelViewMatrix'),
                    'resolution': KK.getUniformLocation(Ku, 'uResolution')
                }
            };
            let KB = Kx.shadersInfo[KO].attribLocations;
            for (let Ks in KB) {
                KW.attribLocations[KB[Ks]] = KK.getAttribLocation(Ku, KB[Ks]);
            }
            let Kl = Kx.shadersInfo[KO].uniformLocations;
            for (let KZ in Kl) {
                KW.uniformLocations[Kl[KZ]] = KK.getUniformLocation(Ku, Kl[KZ]);
            }
            Kx.programs[KO] = KW;
        }
        return KK;
    }
    function IM(Kx, Ky, KK, KO, Ku, KW, KB) {
        Kx.clearColor(0, 0, 0, 0);
        Kx.clearDepth(1);
        Kx.enable(Kx.DEPTH_TEST);
        Kx.depthFunc(Kx.LEQUAL);
        Kx.clear(Kx.COLOR_BUFFER_BIT | Kx.DEPTH_BUFFER_BIT);
        Kx.enable(Kx.BLEND);
        Kx.blendFunc(Kx.ONE, Kx.ONE_MINUS_SRC_ALPHA);
        for (let Kl = -1; Kl < 6 + 1; Kl++) {
            let Ks = Math.floor(KO / 90) * Nq.mapwidth + Kl * Nq.mapwidth + Math.floor(KK / 100);
            for (let KZ = Ks - 1; KZ < Ks + 7 + 1; KZ++) {
                if (KZ >= Nq.map.length)
                    break;
                if (Math.floor(Ks / Nq.mapwidth) != Math.floor(KZ / Nq.mapwidth))
                    break;
                if (Nq.map[KZ] instanceof IN)
                    continue;
                IY(Kx, KZ, Ky, Ku, KW, KB);
            }
        }
    }
    function IY(Kx, Ky, KK, KO, Ku, KW) {
        let KB = KK.programs.imageTex;
        Kx.useProgram(KB.program);
        let Kl = Ih(1, Ky, KW, KO, Ku);
        let Ks = [];
        for (let Kh in Kl) {
            Ks.push(Math.round(Kl[Kh].x));
            Ks.push(Math.round(Kl[Kh].y));
        }
        let KZ = new Float32Array(Ks);
        let Kp = {
            'position': initPositionBuffer(Kx, KZ)
        };
        Kx.activeTexture(Kx.TEXTURE0);
        Kx.uniform1i(KB.uniformLocations.uSampler, 0);
        glSetPositionAttribute(Kx, Kp, KB);
        glSetTextureAttribute(Kx, KK.geometry.clip, KB);
        Kx.uniform2f(KB.uniformLocations.resolution, Kx.canvas.width, Kx.canvas.height);
        Kx.uniformMatrix3fv(KB.uniformLocations.projectionMatrix, ![], KK.data.identityMat);
        Kx.uniformMatrix3fv(KB.uniformLocations.modelViewMatrix, ![], KK.data.identityMat);
        Kx.uniformMatrix3fv(KB.uniformLocations.uTextureMatrix, ![], KK.data.identityMat);
        Kx.drawArrays(Kx.TRIANGLE_FAN, 0, Ks.length / 2);
    }
    function IX(Kx, Ky) {
        const KK = {
            'shadersInfo': {
                'imageTex': {
                    'files': ['./shaders/vsDefault.cpp', './shaders/fsDefault.cpp'],
                    'attribLocations': ['aTextureCoord'],
                    'uniformLocations': ['uSampler', 'uTextureMatrix', 'uTime']
                }
            },
            'shaders': {
                'imageTex': 0
            },
            'textures': {},
            'chunkTextures': {},
            'programs': {},
            'geometry': {},
            'data': {
                'identityMat': new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
            }
        };
        let KO = IQ(KK);
        KK.geometry.clip = {
            'position': initPositionBuffer(KO, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1])),
            'texture': initTextureBuffer(KO, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]))
        };
        let Ku = new OffscreenCanvas(700,540);
        let KW = Ku.getContext('2d');
        let KB = [];
        for (let Kh = 0 - 1; Kh < 6 + 1; Kh++) {
            let Kg = Math.floor(Ky / 90) * Nq.mapwidth + Kh * Nq.mapwidth + Math.floor(Kx / 100);
            for (let Kr = Kg - 1; Kr < Kg + 7 + 1; Kr++) {
                let KD = (Kr - Kg) * 100 + 100;
                let KQ = Kh * 90 + 90;
                let KM = [!(Nq.map[Kr] instanceof IN), !(Nq.map[Kr + 1] instanceof IN), !(Nq.map[Kr + Nq.mapwidth] instanceof IN), !(Nq.map[Kr + Nq.mapwidth + 1] instanceof IN)];
                if (KM[0] && !KM[1] && !KM[2] && !KM[3])
                    KB.push({
                        'x': KD,
                        'y': KQ,
                        'dir': Math.PI / 4
                    });
                if (KM[0] && KM[1] && !KM[2] && KM[3])
                    KB.push({
                        'x': KD,
                        'y': KQ,
                        'dir': -Math.PI / 4
                    });
                if (KM[0] && KM[1] && KM[2] && !KM[3])
                    KB.push({
                        'x': KD,
                        'y': KQ,
                        'dir': -3 * Math.PI / 4
                    });
                if (!KM[0] && KM[1] && !KM[2] && !KM[3])
                    KB.push({
                        'x': KD,
                        'y': KQ,
                        'dir': 3 * Math.PI / 4
                    });
                if (KM[0] && !KM[1] && KM[2] && KM[3])
                    KB.push({
                        'x': KD,
                        'y': KQ,
                        'dir': 3 * Math.PI / 4
                    });
                if (!KM[0] && KM[1] && KM[2] && KM[3])
                    KB.push({
                        'x': KD,
                        'y': KQ,
                        'dir': Math.PI / 4
                    });
            }
        }
        KW.lineJoin = 'round';
        let Kl = Math.floor(Ip.x(Math.floor(Ky / 90) * Nq.mapwidth + Math.floor(Kx / 100)) / 7) * 700;
        let Ks = Math.floor(Ip.y(Math.floor(Ky / 90) * Nq.mapwidth + Math.floor(Kx / 100)) / 6) * 540;
        for (let KY = -1; KY < 6 + 1; KY++) {
            let KX = Math.floor(Ky / 90) * Nq.mapwidth + KY * Nq.mapwidth + Math.floor(Kx / 100);
            for (let KE = KX - 1; KE < KX + 7 + 1; KE++) {
                if (KE >= Nq.map.length)
                    break;
                if (Math.floor(KX / Nq.mapwidth) != Math.floor(KE / Nq.mapwidth))
                    break;
                if (Nq.map[KE] instanceof IN)
                    continue;
                KW.strokeStyle = '#726e60';
                KW.lineWidth = 8;
                let Kv = Ih(1, KE, KB, Kl, Ks);
                Ig(KW, Kv);
            }
        }
        IM(KO, KK, Kx, Ky, Kl, Ks, KB);
        KW.drawImage(KO.canvas, 0, 0);
        KO.getExtension('WEBGL_lose_context').loseContext();
        for (let Ke = 0 - 1; Ke < 6 + 1; Ke++) {
            let KL = Math.floor(Ky / 90) * Nq.mapwidth + Ke * Nq.mapwidth + Math.floor(Kx / 100);
            for (let KS = KL - 1; KS < KL + 7 + 1; KS++) {
                if (KS >= Nq.map.length || KS < 0)
                    break;
                if (Math.floor(KL / Nq.mapwidth) != Math.floor(KS / Nq.mapwidth))
                    break;
                Nq.map[KS].render(KW, (KS - KL) * 100, Ke * 90, ![]);
            }
        }
        for (let KA in KB) {
            break;
            KW.lineWidth = 4;
            KW.strokeStyle = 'red';
            KW.beginPath();
            KW.moveTo(KB[KA].x, KB[KA].y);
            KW.lineTo(KB[KA].x + 10 * Math.cos(KB[KA].dir), KB[KA].y + 10 * Math.sin(KB[KA].dir));
            KW.stroke();
            KW.fillStyle = 'rgba(255, 0, 0, 0.2)';
        }
        let KZ = new OffscreenCanvas(700,540);
        let Kp = KZ.getContext('2d');
        return {
            'front': KZ,
            'back': Ku
        };
    }
    const IE = 16;
    const Iv = 25;
    const Ie = 2;
    const IL = Iv + Ie * 2;
    const IS = IE * IL;
    const IA = {
        'shadowMap': new OffscreenCanvas(IS,IS),
        'shadowCtx': null,
        'shadowMapCaves': new OffscreenCanvas(IS,IS),
        'shadowCavesCtx': null,
        'shadowMapSource': null,
        'shadowCellSize': Iv,
        'shadowCellPadding': Ie,
        'shadowCellStride': IL
    };
    IA.shadowCtx = IA.shadowMap.getContext('2d');
    IA.shadowCavesCtx = IA.shadowMapCaves.getContext('2d');
    function Ik(Kx, Ky) {
        const KK = IA.shadowCellSize;
        const KO = IA.shadowCellPadding;
        const Ku = IA.shadowCellStride;
        Ky.save();
        Ky.resetTransform();
        Ky.globalAlpha = 1;
        Ky.globalCompositeOperation = 'source-over';
        Ky.clearRect(0, 0, Ky.canvas.width, Ky.canvas.height);
        for (let KW = 0; KW < IE; KW++) {
            for (let KB = 0; KB < IE; KB++) {
                const Kl = KB * KK;
                const Ks = KW * KK;
                const KZ = KB * Ku + KO;
                const Kp = KW * Ku + KO;
                Ky.drawImage(Kx, Kl, Ks, KK, KK, KZ, Kp, KK, KK);
                Ky.drawImage(Kx, Kl, Ks, KK, 1, KZ, Kp - KO, KK, KO);
                Ky.drawImage(Kx, Kl, Ks + KK - 1, KK, 1, KZ, Kp + KK, KK, KO);
                Ky.drawImage(Kx, Kl, Ks, 1, KK, KZ - KO, Kp, KO, KK);
                Ky.drawImage(Kx, Kl + KK - 1, Ks, 1, KK, KZ + KK, Kp, KO, KK);
                Ky.drawImage(Kx, Kl, Ks, 1, 1, KZ - KO, Kp - KO, KO, KO);
                Ky.drawImage(Kx, Kl + KK - 1, Ks, 1, 1, KZ + KK, Kp - KO, KO, KO);
                Ky.drawImage(Kx, Kl, Ks + KK - 1, 1, 1, KZ - KO, Kp + KK, KO, KO);
                Ky.drawImage(Kx, Kl + KK - 1, Ks + KK - 1, 1, 1, KZ + KK, Kp + KK, KO, KO);
            }
        }
        Ky.restore();
    }
    function Io() {
        const Kx = Nc['./images/shadowmap.png'];
        if (!Kx?.complete || Kx.naturalWidth === 0)
            return ![];
        if (IA.shadowMapSource === Kx)
            return !![];
        const Ky = IE * Iv;
        const KK = new OffscreenCanvas(Ky,Ky);
        const KO = KK.getContext('2d');
        KO.drawImage(Kx, 0, 0, Ky, Ky);
        KO.globalCompositeOperation = 'multiply';
        KO.fillStyle = 'rgba(0, 30, 60, 1.0)';
        KO.fillRect(0, 0, Ky, Ky);
        KO.globalCompositeOperation = 'destination-in';
        KO.drawImage(Kx, 0, 0, Ky, Ky);
        Ik(KK, IA.shadowCtx);
        const Ku = new OffscreenCanvas(Ky,Ky);
        const KW = Ku.getContext('2d');
        KW.fillStyle = 'rgba(0, 0, 20, 0.15)';
        KW.fillRect(0, 0, Ky, Ky);
        KW.globalCompositeOperation = 'destination-out';
        KW.drawImage(Kx, 0, 0, Ky, Ky);
        Ik(Ku, IA.shadowCavesCtx);
        IA.shadowMapSource = Kx;
        return !![];
    }
    let IT = {
        'right': [{
            'x': 100,
            'y': 0
        }, {
            'x': 95,
            'y': 20
        }, {
            'x': 100,
            'y': 40
        }, {
            'x': 92,
            'y': 60
        }, {
            'x': 100,
            'y': 75
        }, {
            'x': 100,
            'y': 90
        }],
        'left': [{
            'x': 0,
            'y': 0
        }, {
            'x': 5,
            'y': 18
        }, {
            'x': 0,
            'y': 38
        }, {
            'x': 8,
            'y': 60
        }, {
            'x': 0,
            'y': 80
        }, {
            'x': 0,
            'y': 90
        }],
        'top': [{
            'x': 0,
            'y': 0
        }, {
            'x': 20,
            'y': 5
        }, {
            'x': 50,
            'y': 0
        }, {
            'x': 75,
            'y': 7
        }, {
            'x': 100,
            'y': 0
        }],
        'bottom': [{
            'x': 0,
            'y': 90
        }, {
            'x': 18,
            'y': 85
        }, {
            'x': 45,
            'y': 90
        }, {
            'x': 70,
            'y': 88
        }, {
            'x': 100,
            'y': 90
        }]
    };
    function IJ(Kx, Ky, KK, KO) {
        Kx.beginPath();
        for (let Ku = 0; Ku < Ky.length; Ku++) {
            if (Ku === 0) {
                Kx.moveTo(KK + Ky[Ku].x, KO + Ky[Ku].y);
            } else {
                Kx.lineTo(KK + Ky[Ku].x, KO + Ky[Ku].y);
            }
        }
        Kx.closePath();
        Kx.fill();
    }
    function Id(Kx, Ky) {
        let KK = new OffscreenCanvas(700,540);
        let KO = KK.getContext('2d');
        let Ku = Ky / 540 * Math.ceil(Nq.mapwidth * 100 / 700) + Kx / 700;
        for (let Kl in Nq.propsHash[Ku]) {
            let Ks = Nq.propsHash[Ku][Kl];
            let KZ = Nq.props[Ks];
            let Kp = Il[KZ[3]];
            if (Kp[5] != 1)
                continue;
            KO.translate(KZ[0] - Kx, KZ[1] - Ky);
            KO.rotate(-KZ[2] * Math.PI / 180);
            let Kh = Kp[7] ?? './images/propsmap.png';
            KO.drawImage(Nc[Kh], Kp[0], Kp[1], Kp[2], Kp[3], -Kp[2] / 2, -Kp[3] / 2, Kp[2], Kp[3]);
            KO.resetTransform();
        }
        Io();
        for (let Kg = 0; Kg < 6; Kg++) {
            let Kr = Math.floor(Ky / 90) * Nq.mapwidth + Kg * Nq.mapwidth + Math.floor(Kx / 100);
            for (let KD = Kr; KD < Kr + 7; KD++) {
                if (KD >= Nq.map.length)
                    break;
                if (Math.floor(Kr / Nq.mapwidth) != Math.floor(KD / Nq.mapwidth))
                    break;
                let KQ = (KD - Kr) * 100;
                let KM = Kg * 90;
                let KY = Nq.map;
                let KX = Nq.mapwidth;
                Nq.map[KD].render(KO, KQ, KM);
                if (!Nq.map[KD].goThru() && Nq.map[KD].top !== 0) {
                    if (Nq.map[KD - 1]?.top === 0 && !Nq.map[KD - 1].goThru()) {
                        KO.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        KO.fillRect(KQ, KM, 4, 28);
                    }
                    if (Nq.map[KD + 1]?.top === 0 && !Nq.map[KD + 1].goThru()) {
                        KO.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        KO.fillRect(KQ + 100 - 4, KM, 4, 28);
                    }
                }
                if (KY[KD].cave) {
                    let KE = KY[KD - KX - 1]?.goThru() * 128 + KY[KD - KX]?.goThru() * 64 + KY[KD - KX + 1]?.goThru() * 32 + KY[KD - 1]?.goThru() * 16 + KY[KD + 1]?.goThru() * 8 + KY[KD + KX - 1]?.goThru() * 4 + KY[KD + KX]?.goThru() * 2 + KY[KD + KX + 1]?.goThru() * 1;
                    const Kv = IA.shadowCellSize;
                    let Ke = KE % 16 * IA.shadowCellStride + IA.shadowCellPadding;
                    let KL = Math.floor(KE / 16) * IA.shadowCellStride + IA.shadowCellPadding;
                    KO.drawImage(IA.shadowMapCaves, Ke, KL, Kv, Kv, (KD - Kr) * 100, Kg * 90, 100, 90);
                }
            }
        }
        KO.globalCompositeOperation = 'destination-out';
        KO.fillStyle = 'black';
        for (let KS = 0; KS < 6; KS++) {
            let KA = Math.floor(Ky / 90) * Nq.mapwidth + KS * Nq.mapwidth + Math.floor(Kx / 100);
            for (let Kk = KA; Kk < KA + 7; Kk++) {
                if (Kk >= Nq.map.length)
                    break;
                if (Math.floor(KA / Nq.mapwidth) != Math.floor(Kk / Nq.mapwidth))
                    break;
                if (Kk < 0)
                    continue;
                let Ko = (Kk - KA) * 100;
                let KT = KS * 90;
                let KJ = Nq.map;
                let Kd = Nq.mapwidth;
                if (!KJ[Kk].cave)
                    continue;
                if (!KJ[Kk - Kd]?.cave && KJ[Kk - Kd]?.light)
                    IJ(KO, IT.top, Ko, KT);
                if (!KJ[Kk - 1]?.cave && KJ[Kk - 1]?.light)
                    IJ(KO, IT.left, Ko, KT);
                if (!KJ[Kk + 1]?.cave && KJ[Kk + 1]?.light)
                    IJ(KO, IT.right, Ko, KT);
                if (!KJ[Kk + Kd]?.cave && KJ[Kk + Kd]?.light)
                    IJ(KO, IT.bottom, Ko, KT);
            }
        }
        KO.globalCompositeOperation = 'source-over';
        let KW = new OffscreenCanvas(700,540);
        let KB = KW.getContext('2d');
        for (let Kw in Nq.propsHash[Ku]) {
            let KP = Nq.propsHash[Ku][Kw];
            let KH = Nq.props[KP];
            let Kt = Il[KH[3]];
            if (Kt[5] == 1)
                continue;
            let KV = KB;
            if (Kt[5] == 2)
                KV = KO;
            KV.translate(KH[0] - Kx, KH[1] - Ky);
            KV.rotate(-KH[2] * Math.PI / 180);
            let Kj = Kt[7] ?? './images/propsmap.png';
            KV.drawImage(Nc[Kj], Kt[0], Kt[1], Kt[2], Kt[3], -Kt[2] / 2, -Kt[3] / 2, Kt[2], Kt[3]);
            KV.resetTransform();
        }
        KB.globalAlpha = 0.7;
        for (let Kc = 0; Kc < 6; Kc++) {
            let Kq = Math.floor(Ky / 90) * Nq.mapwidth + Kc * Nq.mapwidth + Math.floor(Kx / 100);
            for (let Kb = Kq; Kb < Kq + 7; Kb++) {
                if (Kb >= Nq.map.length)
                    break;
                if (Math.floor(Kq / Nq.mapwidth) != Math.floor(Kb / Nq.mapwidth))
                    break;
                let KF = Nq.map;
                let KU = Nq.mapwidth;
                if (!KF[Kb].light) {
                    let KC = !KF[Kb - KU - 1]?.light * 128 + !KF[Kb - KU]?.light * 64 + !KF[Kb - KU + 1]?.light * 32 + !KF[Kb - 1]?.light * 16 + !KF[Kb + 1]?.light * 8 + !KF[Kb + KU - 1]?.light * 4 + !KF[Kb + KU]?.light * 2 + !KF[Kb + KU + 1]?.light * 1;
                    const Kz = IA.shadowCellSize;
                    let Kf = KC % 16 * IA.shadowCellStride + IA.shadowCellPadding;
                    let KR = Math.floor(KC / 16) * IA.shadowCellStride + IA.shadowCellPadding;
                    KB.drawImage(IA.shadowMap, Kf, KR, Kz, Kz, (Kb - Kq) * 100, Kc * 90, 100, 90);
                }
            }
        }
        return {
            'front': KW,
            'back': KK
        };
    }
    const Iw = 1;
    const IP = 2;
    const IH = 4;
    const It = 4;
    const IV = navigator.deviceMemory && navigator.deviceMemory <= 4 ? 16 : 20;
    const Ij = typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap === 'function';
    let Ic = Object.create(null);
    let Iq = 0;
    const Ib = {
        'worker': null,
        'status': Ij ? 'idle' : 'unsupported',
        'revision': 0,
        'queue': new Map(),
        'inFlight': null,
        'visibleKeys': new Set(),
        'lastScheduleSignature': null,
        'warningShown': ![]
    };
    function IF(Kx) {
        return KI != null && Object.prototype.hasOwnProperty.call(KI, Kx);
    }
    function IU(Kx) {
        if (!Kx)
            return;
        const Ky = new Set();
        for (const KK of [Kx.back, Kx.front]) {
            if (!KK || Ky.has(KK))
                continue;
            Ky.add(KK);
            if (typeof KK.close === 'function') {
                KK.close();
            } else if (typeof OffscreenCanvas !== 'undefined' && KK instanceof OffscreenCanvas) {
                KK.width = 1;
                KK.height = 1;
            }
        }
    }
    function IC() {
        if (KI != null) {
            for (const Kx in KI) {
                IU(KI[Kx]);
            }
        }
        KI = {};
        Ic = Object.create(null);
        Ib.lastScheduleSignature = null;
    }
    function Iz(Kx) {
        Ic[Kx] = ++Iq;
    }
    function If(Kx=Ib.visibleKeys) {
        if (KI == null)
            return;
        let Ky = Object.keys(KI);
        while (Ky.length > IV) {
            let KK = null;
            let KO = Infinity;
            for (const Ku of Ky) {
                if (Kx instanceof Set ? Kx.has(Ku) : Ku in Kx)
                    continue;
                const KW = Ic[Ku] ?? 0;
                if (KW < KO) {
                    KO = KW;
                    KK = Ku;
                }
            }
            if (KK === null)
                break;
            IU(KI[KK]);
            delete KI[KK];
            delete Ic[KK];
            Ky = Object.keys(KI);
        }
    }
    function IR(Kx, Ky) {
        if (IF(Kx))
            IU(KI[Kx]);
        KI[Kx] = Ky;
        Iz(Kx);
        If();
    }
    function Im(Kx) {
        if (Kx instanceof IO)
            return Iw;
        if (Kx instanceof Iy)
            return IP;
        return 0;
    }
    function In(Kx) {
        const Ky = Im(Kx);
        const KK = Ky | (Kx.top === 0 ? 0 : IH);
        const KO = Math.max(0, Math.min(3, Math.round((Kx.sX ?? 0) / 100)));
        const Ku = Math.max(0, Math.min(3, Math.round((Kx.sY ?? 0) / 90)));
        return [Kx.type, KK, Ku * 4 + KO];
    }
    function a0() {
        const Kx = new Uint16Array(Nq.map.length);
        const Ky = new Uint8Array(Nq.map.length);
        const KK = new Uint8Array(Nq.map.length);
        for (let KO = 0; KO < Nq.map.length; KO++) {
            const Ku = In(Nq.map[KO]);
            Kx[KO] = Ku[0];
            Ky[KO] = Ku[1];
            KK[KO] = Ku[2];
        }
        return {
            'tileTypes': Kx,
            'tileStates': Ky,
            'tileBorders': KK
        };
    }
    function a1() {
        const Kx = new Map([['tiles', 'tiles'], ['borders', './images/borders.png'], ['shadowmap', './images/shadowmap.png']]);
        for (const Ky of Nq.props ?? []) {
            const KK = Il[Ky[3]];
            if (!KK)
                continue;
            const KO = KK[7] ?? './images/propsmap.png';
            Kx.set(KO, KO);
        }
        return Kx;
    }
    function a2(Kx, Ky) {
        const KK = Kx?.naturalWidth ?? Kx?.width ?? 0;
        if (Kx && Kx.complete !== ![] && KK > 0)
            return Promise.resolve();
        if (!Kx)
            return Promise.reject(new Error('Missing tile-layer image: ' + Ky));
        return new Promise( (KO, Ku) => {
            let KW = ![];
            const KB = Kp => {
                if (KW)
                    return;
                KW = !![];
                clearTimeout(KZ);
                Kx.removeEventListener?.('load', Kl);
                Kx.removeEventListener?.('error', Ks);
                Kp();
            }
            ;
            const Kl = () => KB(KO);
            const Ks = () => KB( () => Ku(new Error('Unable to load tile-layer image: ' + Ky)));
            const KZ = setTimeout( () => Ks(), 15000);
            Kx.addEventListener?.('load', Kl, {
                'once': !![]
            });
            Kx.addEventListener?.('error', Ks, {
                'once': !![]
            });
        }
        );
    }
    function a3(Kx) {
        for (const Ky of Kx)
            Ky[1]?.close?.();
    }
    function a4(Kx, Ky) {
        if (Ib.worker !== Kx)
            return;
        Kx.terminate();
        Ib.worker = null;
        Ib.status = 'failed';
        Ib.inFlight = null;
        Ib.queue.clear();
        if (!Ib.warningShown) {
            Ib.warningShown = !![];
            console.warn('Tile-layer Worker unavailable; using synchronous fallback.', Ky);
        }
    }
    function a5(Kx, Ky) {
        const KK = Ky.data;
        if (Ib.worker !== Kx) {
            KK.back?.close?.();
            KK.front?.close?.();
            return;
        }
        if (KK.type === 'ready') {
            if (KK.revision !== Ib.revision)
                return;
            Ib.status = 'ready';
            a7();
            return;
        }
        if (KK.type === 'error') {
            a4(Kx, KK.message);
            return;
        }
        if (KK.type !== 'chunk' && KK.type !== 'skipped')
            return;
        if (Ib.inFlight?.key === KK.key) {
            Ib.inFlight = null;
        }
        if (KK.type === 'chunk') {
            if (KK.revision === Ib.revision) {
                IR(KK.key, {
                    'back': KK.back,
                    'front': KK.front
                });
            } else {
                KK.back?.close?.();
                KK.front?.close?.();
            }
        }
        a7();
    }
    async function a6() {
        if (!Ij || Ib.status !== 'idle')
            return;
        const Kx = Ib.revision;
        const Ky = encodeURIComponent(window.REALMZ_BUILD_VERSION ?? 'development');
        const KK = new Worker('/tileLayerWorker.js?v=' + Ky);
        Ib.worker = KK;
        Ib.status = 'initializing';
        KK.onmessage = Ku => a5(KK, Ku);
        KK.onerror = Ku => a4(KK, Ku.message || Ku.error || Ku);
        const KO = [];
        try {
            for (const [KB,Kl] of a1()) {
                const Ks = Nc[Kl];
                await a2(Ks, Kl);
                KO.push([KB, await createImageBitmap(Ks)]);
            }
            if (Ib.worker !== KK || Ib.revision !== Kx) {
                a3(KO);
                return;
            }
            const Ku = a0();
            const KW = [Ku.tileTypes.buffer, Ku.tileStates.buffer, Ku.tileBorders.buffer, ...KO.map(KZ => KZ[1])];
            KK.postMessage({
                'type': 'init',
                'revision': Kx,
                'mapWidth': Nq.mapwidth,
                'mapHeight': Nq.mapheight,
                'tileTypes': Ku.tileTypes,
                'tileStates': Ku.tileStates,
                'tileBorders': Ku.tileBorders,
                'tileIndex': Nq.tileIndex,
                'props': Nq.props,
                'propsHash': Nq.propsHash,
                'propmapIndex': Il,
                'images': KO
            }, KW);
        } catch (KZ) {
            a3(KO);
            a4(KK, KZ);
        }
    }
    function a7() {
        if (Ib.status !== 'ready' || Ib.inFlight !== null)
            return;
        let Kx = null;
        for (const Ky of Ib.queue.values()) {
            if (Kx === null || Ky.priority < Kx.priority || Ky.priority === Kx.priority && Ky.distance < Kx.distance) {
                Kx = Ky;
            }
        }
        if (Kx === null)
            return;
        Ib.queue['delete'](Kx.key);
        Ib.inFlight = Kx;
        try {
            Ib.worker.postMessage({
                'type': 'generate',
                'key': Kx.key,
                'x': Kx.x,
                'y': Kx.y,
                'revision': Ib.revision
            });
        } catch (KK) {
            a4(Ib.worker, KK);
        }
    }
    function a8(Kx, Ky, KK, KO, Ku) {
        if (IF(Kx) || Ib.inFlight?.key === Kx)
            return;
        const KW = (Ky + 350 - Ku.x) ** 2 + (KK + 270 - Ku.y) ** 2;
        const KB = Ib.queue.get(Kx);
        if (KB) {
            KB.priority = Math.min(KB.priority, KO);
            KB.distance = KW;
            KB.x = Ky;
            KB.y = KK;
            return;
        }
        Ib.queue.set(Kx, {
            'key': Kx,
            'x': Ky,
            'y': KK,
            'priority': KO,
            'distance': KW
        });
    }
    function a9(Kx, Ky) {
        return String(Ky * Math.ceil(Nq.mapwidth * 100 / 700) + Kx);
    }
    function aI(Kx, Ky) {
        const KK = new Set(Object.keys(Kx));
        const KO = new Map();
        const Ku = Math.floor(Math.max(0, Nq.mapwidth * 100 - 10) / 700) * 700;
        const KW = Math.floor(Math.max(0, Nq.mapheight * 90 - 10) / 540) * 540;
        const KB = [[-700, 0], [700, 0], [0, -540], [0, 540]];
        for (const Kl of Object.values(Kx)) {
            for (const Ks of KB) {
                const KZ = Kl.x + Ks[0];
                const Kp = Kl.y + Ks[1];
                if (KZ < 0 || Kp < 0 || KZ > Ku || Kp > KW)
                    continue;
                const Kh = a9(KZ, Kp);
                if (KK.has(Kh) || KO.has(Kh))
                    continue;
                KO.set(Kh, {
                    'key': Kh,
                    'x': KZ,
                    'y': Kp,
                    'distance': (KZ + 350 - Ky.x) ** 2 + (Kp + 270 - Ky.y) ** 2
                });
            }
        }
        return [...KO.values()].sort( (Kg, Kr) => Kg.distance - Kr.distance).slice(0, Math.max(0, Math.min(It, IV - KK.size)));
    }
    function aa(Kx, Ky) {
        if (!Ij || Ib.status === 'failed')
            return ![];
        const KK = Object.keys(Kx);
        const KO = KK.join('|');
        if (KO === Ib.lastScheduleSignature) {
            a7();
            return !![];
        }
        Ib.lastScheduleSignature = KO;
        const Ku = new Set(KK);
        Ib.visibleKeys = Ku;
        const KW = new Set(Ku);
        for (const KB of Ku) {
            if (IF(KB)) {
                Iz(KB);
            } else {
                const Kl = Kx[KB];
                a8(KB, Kl.x, Kl.y, 0, Ky);
            }
        }
        for (const Ks of aI(Kx, Ky)) {
            KW.add(Ks.key);
            a8(Ks.key, Ks.x, Ks.y, 1, Ky);
        }
        for (const KZ of Ib.queue.keys()) {
            if (!KW.has(KZ))
                Ib.queue['delete'](KZ);
        }
        If(Ku);
        if (Ib.status === 'idle')
            a6();
        a7();
        return !![];
    }
    function aG(Kx) {
        Ib.revision++;
        Ib.queue.clear();
        if (Ib.status === 'initializing') {
            Ib.worker?.terminate();
            Ib.worker = null;
            Ib.inFlight = null;
            Ib.status = 'idle';
            return;
        }
        if (Ib.status !== 'ready')
            return;
        const Ky = [];
        for (const KK of Kx) {
            const KO = In(Nq.map[KK.i]);
            Ky.push([KK.i, KO[0], KO[1], KO[2]]);
        }
        try {
            Ib.worker.postMessage({
                'type': 'updateTiles',
                'revision': Ib.revision,
                'patches': Ky
            });
        } catch (Ku) {
            a4(Ib.worker, Ku);
        }
    }
    function ai() {
        IC();
        Ib.revision++;
        Ib.queue.clear();
        Ib.inFlight = null;
        Ib.visibleKeys = new Set();
        Ib.lastScheduleSignature = null;
        Ib.worker?.terminate();
        Ib.worker = null;
        Ib.status = Ij ? 'idle' : 'unsupported';
        Ib.warningShown = ![];
    }
    function aN(Kx, Ky, KK) {
        if (!Nq.settings.shadows)
            return;
        let KO = new Array(7 * 6).fill(0);
        for (let Kl = 0; Kl < KO.length; Kl++) {
            KO[Kl] = new Array(Kx * Kx).fill(0);
        }
        let Ku = Ks => {
            return Nq.map[Ip.i({
                'x': Ks.x / Kx,
                'y': Ks.y / Kx
            })].light;
        }
        ;
        let KW = Ks => {
            return Ks.x + ',' + Ks.y;
        }
        ;
        let KB = 0;
        for (let Ks = 0; Ks < 6; Ks++) {
            let KZ = Math.floor(KK / 90) * Nq.mapwidth + Ks * Nq.mapwidth + Math.floor(Ky / 100);
            for (let Kp = KZ; Kp < KZ + 7; Kp++) {
                if (Kp >= Nq.map.length)
                    break;
                if (Math.floor(KZ / Nq.mapwidth) != Math.floor(Kp / Nq.mapwidth))
                    break;
                if (!Nq.map[Kp].light) {
                    for (let Kh = 0; Kh < Kx * Kx; Kh++) {
                        let Kg = {};
                        let Kr = Ip.x(Kp) * Kx + Kh % Kx;
                        let KD = Ip.y(Kp) * Kx + Math.floor(Kh / Kx);
                        let KQ = [{
                            'x': Kr + 1,
                            'y': KD
                        }, {
                            'x': Kr - 1,
                            'y': KD
                        }, {
                            'x': Kr,
                            'y': KD - 1
                        }, {
                            'x': Kr,
                            'y': KD + 1
                        }];
                        KO[KB][Kh] = 0;
                        let KM = ![];
                        let KY = 0;
                        while (!KM && KY < 5) {
                            let KX = [];
                            for (let KE in KQ) {
                                Kg[KW(KQ[KE])] = !![];
                                if (Ku(KQ[KE])) {
                                    KM = !![];
                                    break;
                                }
                                let Kv = [{
                                    'x': KQ[KE].x + 1,
                                    'y': KQ[KE].y
                                }, {
                                    'x': KQ[KE].x - 1,
                                    'y': KQ[KE].y
                                }, {
                                    'x': KQ[KE].x,
                                    'y': KQ[KE].y + 1
                                }, {
                                    'x': KQ[KE].x,
                                    'y': KQ[KE].y - 1
                                }];
                                for (let Ke in Kv) {
                                    let KL = KW(Kv[Ke]);
                                    if (!(KL in Kg)) {
                                        Kg[KL] = !![];
                                        KX.push(Kv[Ke]);
                                    }
                                }
                            }
                            KQ = KX;
                            KY++;
                        }
                        KO[KB][Kh] = (KY - 1) / (Kx / 3);
                    }
                }
                KB += 1;
            }
        }
        return KO;
    }
    function ax(Kx, Ky) {
        let KK = [];
        for (let KO in Kx) {
            let Ku = Nq.mapwidth;
            let KW = Nq.mapheight;
            let KB = Math.floor(Kx[KO][0] / Ia);
            let Kl = Math.floor(Kx[KO][1] / IG);
            let Ks = Ku * Kl + KB;
            let KZ = Nq.map[Ks].type;
            KZ = Ky[KZ];
            KK.push(new IB(Kx[KO][0],Kx[KO][1],Kx[KO][2],KZ));
        }
        return KK;
    }
    function ay(Kx, Ky, KK, KO, Ku) {
        let KW = Kx % Ku;
        let KB = Math.floor(Kx / Ku);
        if (Nq.tileIndex[KO].liquid) {
            return new Iu(KW,KB,KO,'water');
        } else if (KO == 0 || Nq.tileIndex[KO].invis) {
            return new IN(KW,KB,KO,'grass');
        } else if (Nq.tileIndex[KO].wall === !![]) {
            return new Iy(KW,KB,KO,'grass');
        } else {
            return new IO(KW,KB,KO,'grass');
        }
    }
    function aK(Kx, Ky, KK, KO) {
        let Ku = [];
        Ky += String.fromCharCode(22).repeat(7 * KO.mapwidth);
        for (let Kh = 0; Kh < Ky.length; Kh++) {
            let Kg = Ky[Kh].charCodeAt(0);
            let Kr = ay(Kh, null, null, Kg, KO.mapwidth);
            Ku.push(Kr);
        }
        let KW = (KD, KQ) => {
            let KM = (KX, KE) => {
                let Kv = KD + KX;
                let Ke = (KQ + KE) * KO.mapwidth;
                let KL = Ke + Kv;
                let KS = KQ * KO.mapwidth + KD;
                if (Ku[KL] == undefined)
                    return !![];
                if (!(Ku[KS] instanceof Iu)) {
                    return Ku[KL] instanceof IN || Ku[KL] instanceof Iu;
                } else {
                    return Ku[KL] instanceof IN;
                }
            }
            ;
            let KY = new Array(4).fill(![]);
            KY[0] = KM(0, -1);
            KY[1] = KM(-1, 0);
            KY[2] = KM(1, 0);
            KY[3] = KM(0, 1);
            return KY;
        }
        ;
        for (let KD in Ku) {
            let KQ = KD - KO.mapwidth;
            if (KQ < 0 || Ku[KQ] instanceof IN || Ku[KQ] instanceof Iu)
                Ku[KD].top = 0;
        }
        for (let KM in KK) {
            Ku[KM].flowers = [{
                't': KK[KM][0].charCodeAt(0),
                'off': KK[KM][1],
                'f': Math.round(Math.random()),
                'sf': 0.8 + Math.round(Math.random() * 4) / 10
            }];
        }
        let KB = Nq.minimap;
        let Kl = KB.getContext('2d');
        KB.width = KO.mapwidth * 2;
        KB.height = KO.mapheight * 2;
        i('minimap').width = KO.mapwidth * 2;
        i('minimap').height = KO.mapheight * 2;
        let Ks = 0;
        let KZ = 0;
        for (let KY = 0; KY < Ku.length; KY++) {
            let KX = KY % KO.mapwidth;
            let KE = Math.floor(KY / KO.mapwidth);
            if (!(Ku[KY] instanceof IN)) {
                Kl.fillStyle = Nq.tileIndex[Ku[KY].type].top.filter[0];
                Kl.fillRect(KX * 2, KE * 2, 2, 2);
            }
            KX++;
        }
        let Kp = {
            '23': {
                'x': 0,
                'y': 0
            },
            '123': {
                'x': 100,
                'y': 0
            },
            '13': {
                'x': 200,
                'y': 0
            },
            '3': {
                'x': 300,
                'y': 0
            },
            '023': {
                'x': 0,
                'y': 90
            },
            '0123': {
                'x': 100,
                'y': 90
            },
            '013': {
                'x': 200,
                'y': 90
            },
            '03': {
                'x': 300,
                'y': 90
            },
            '02': {
                'x': 0,
                'y': 180
            },
            '012': {
                'x': 100,
                'y': 180
            },
            '01': {
                'x': 200,
                'y': 180
            },
            '0': {
                'x': 300,
                'y': 180
            },
            '2': {
                'x': 0,
                'y': 270
            },
            '12': {
                'x': 100,
                'y': 270
            },
            '1': {
                'x': 200,
                'y': 270
            },
            '': {
                'x': 300,
                'y': 270
            }
        };
        for (let Kv = 0; Kv < Ku.length; Kv++) {
            let Ke = KW(Ku[Kv].x / Ia, Ku[Kv].y / IG);
            let KL = '';
            for (let KS in Ke)
                if (!Ke[KS])
                    KL += KS;
            Ku[Kv].sX = Kp[KL].x;
            Ku[Kv].sY = Kp[KL].y;
        }
        Kx.mapwidth = KO.mapwidth;
        Kx.mapheight = KO.mapheight;
        console.log('map parsed');
        Kx.map = Ku;
    }
    function aO(Kx, Ky, KK, KO, Ku) {
        let KW = [];
        let KB = {
            '-': IN,
            'X': IO,
            '*': IN,
            '.': Iy,
            'O': IN,
            'x': IO,
            'I': IO,
            'i': IO,
            '(': IN,
            '&': IN,
            '^': IN,
            ',': Iy,
            'T': Ix,
            'M': Ix,
            'W': Iu,
            ':': Iy,
            'L': IK,
            'S': IO
        };
        let Kl = {
            'I': 'snow',
            'i': 'snow',
            'X': 'grass',
            'x': 'grass',
            'S': 'cave'
        };
        let Ks = {
            'snow': '#70c1ef',
            'grass': '#84d87f',
            'cave': '#AAA'
        };
        for (let KX in KO) {
            if (KO[KX] == 'tree') {
                KB[KX] = Ix;
            } else if (KO[KX] == 'wall') {
                KB[KX] = Iy;
            } else {
                Kl[KX] = KO[KX];
                KB[KX] = IO;
            }
        }
        let KZ = 0;
        let Kp = 0;
        KZ = Ky.match(/0/).index;
        let Kh = (Nq.mapSettings.extension ?? 'S').repeat(KZ) + '0';
        for (let KE = 0; KE < 7; KE++) {
            Ky += Kh;
        }
        let Kg = (Kv, Ke) => {
            let KL = (KA, Kk, Ko) => {
                let KT = Kv + KA;
                let KJ = (Ke + Kk) * KZ;
                let Kd = KJ + KT;
                if (KW[Kd] == undefined)
                    return !![];
                if (Ko != null && KW[Kd].type.match(Ko))
                    return !![];
                return KW[Kd] instanceof IN;
            }
            ;
            let KS = new Array(4).fill(![]);
            KS[0] = KL(0, -1);
            KS[1] = KL(-1, 0, /L/);
            KS[2] = KL(1, 0, /L/);
            KS[3] = KL(0, 1);
            return KS;
        }
        ;
        let Kr = 0;
        let KD = 0;
        for (let Kv = 0; Kv < Ky.length; Kv++) {
            if (Ky[Kv] === '0') {
                KZ = Kr;
                Kr = 0;
                ++KD;
                continue;
            }
            if (!(Ky[Kv] in KB))
                continue;
            let Ke = new KB[Ky[Kv]](Kr,KD,Ky[Kv],Kl[Ky[Kv]]);
            KW.push(Ke);
            Kr++;
        }
        Kp = KD;
        let KQ = {
            '23': {
                'x': 0,
                'y': 0
            },
            '123': {
                'x': 100,
                'y': 0
            },
            '13': {
                'x': 200,
                'y': 0
            },
            '3': {
                'x': 300,
                'y': 0
            },
            '023': {
                'x': 0,
                'y': 90
            },
            '0123': {
                'x': 100,
                'y': 90
            },
            '013': {
                'x': 200,
                'y': 90
            },
            '03': {
                'x': 300,
                'y': 90
            },
            '02': {
                'x': 0,
                'y': 180
            },
            '012': {
                'x': 100,
                'y': 180
            },
            '01': {
                'x': 200,
                'y': 180
            },
            '0': {
                'x': 300,
                'y': 180
            },
            '2': {
                'x': 0,
                'y': 270
            },
            '12': {
                'x': 100,
                'y': 270
            },
            '1': {
                'x': 200,
                'y': 270
            },
            '': {
                'x': 300,
                'y': 270
            }
        };
        for (let KL = 0; KL < KW.length; KL++) {
            let KS = Kg(KW[KL].x / Ia, KW[KL].y / IG);
            let KA = '';
            for (let Kk in KS)
                if (!KS[Kk])
                    KA += Kk;
            KW[KL].sX = KQ[KA].x;
            KW[KL].sY = KQ[KA].y;
        }
        for (let Ko in KK) {
            KW[Ko].flowers = [{
                't': KK[Ko][0],
                'off': KK[Ko][1],
                'f': Math.round(Math.random()),
                'sf': 0.8 + Math.round(Math.random() * 4) / 10
            }];
        }
        let KM = document.getElementById('minimap');
        let KY = KM.getContext('2d');
        KM.width = KZ * 2;
        KM.height = Kp * 2;
        Kr = 0;
        KD = 0;
        for (let KT = 0; KT < Ky.length; KT++) {
            if (Ky[KT] === '0') {
                Kr = 0;
                ++KD;
                continue;
            }
            if (!(Ky[KT] in KB))
                continue;
            let KJ = Kl[Ky[KT]];
            if (KJ != null) {
                KY.fillStyle = Ks[KJ];
                KY.fillRect(Kr * 2, KD * 2, 2, 2);
            }
            Kr++;
        }
        Kx.mapwidth = KZ;
        Kx.mapheight = Kp;
        Kx.map = KW;
        Kx.bushes = ax(Ku, Kl);
    }
    const au = {
        'NoWeapon': ag,
        'Swordsman': Gj,
        'Archer': GY,
        'Gunner': Gs,
        'Sniper': Gl,
        'Marksman': GX,
        'Grenadier': Gu,
        'Bomber': GO,
        'Lancer': i8,
        'Dragoon': i9,
        'Paladin': Gf,
        'Magician': aX,
        'Sorcerer': aL,
        'Charge Blaster': ad,
        'Whirlpooler': aw,
        'Star Blaster': Gi,
        'Puncher': GL,
        'Aura Shield': GJ,
        'Aura Monk': Go,
        'Aura Master': GT,
        'Shield': Gq,
        'Behemoth': Gc,
        'Rocketeer': GZ,
        'Umbrellar': GQ,
        'Scythe': GA,
        'Mirror': Gz,
        'Crossbower': ab,
        'Champion': i7,
        'Mana Flail': GW,
        'Winged Bow': aC,
        'Boomstick': aH,
        'Shotgun': aq,
        'Infernal Mage': aE,
        'Alchemist': aY,
        'Holy Hammer': i6,
        'Pulse Gun': az,
        'Mechanical Terror': GG,
        'Rune Wizard': GJ,
        'Spear': Ga,
        'Solar Flare': GM,
        'rockpaladin': GR,
        'Sabre': Gm,
        'Death Sabre': Gn,
        'Aura Lord': i5,
        'Cake Cannon': G9,
        'Gatling Gun': G8,
        'Katana': i4,
        'Blunderbuss': aj,
        'Excalibur': i0,
        'Slasher': i1,
        'Fire Caster': aU,
        'Frost Staff': aT,
        'Blizzard Staff': aJ,
        'Pistol': G6,
        'Shotgun2': G2,
        'Item': ah,
        'Spork': G0,
        'Cannon': ac,
        'Cyber Blaster': ae,
        'Railgun': aV,
        'Pulse Bow': af,
        'AHR': G7,
        'Pyrusbow': an,
        'Spitter': aS,
        'Fume Breather': ao,
        'Giant': Gk,
        'Emote': aD,
        'Zen Monk': Gd,
        'Orb Sage': Gw,
        'Slap Hand': GS,
        'Dynamiter': GN,
        'Sharpshooter': aF,
        'Clipper': aA,
        'Spanomancer': ak,
        'Knight': GU,
        'Beast Rider': GC,
        'Cake Blaster': GI,
        'Meteor Staff': av,
        'Berserker': i2,
        'Nuker': Gy,
        'Manipulator': aR,
        'GreaterTome': am,
        'Librarian': at,
        'Glaive': G5,
        'Knife Thrower': Gh,
        'Assassin': Gg,
        'Shurikenier': Gp,
        'Boomeranger': GD,
        'Jouster': iI,
        'Fang': GV,
        'Harvester': i3,
        'Flamethrower': G1,
        'Flower Mage': aP,
        'Plasma Dagger': GP,
        'Plasma Spear': GH,
        'Chrome Orb': Gt,
        'Storm Rider': aQ,
        'Fang': GV,
        'Spark Mage': G3,
        'Channeler': G4,
        'Reflector': GF,
        'Smoke Gernader': Gx,
        'Executor': Gr
    };
    const aW = new Map();
    const aB = 32;
    function al(Kx, Ky, KK) {
        const KO = Nc['./images/light/circle.png'];
        if (!KO?.complete || KO.naturalWidth === 0)
            return null;
        const Ku = Kx + ',' + Ky + ',' + KK;
        let KW = aW.get(Ku);
        if (KW != null)
            return KW;
        KW = document.createElement('canvas');
        KW.width = 256;
        KW.height = 256;
        const KB = KW.getContext('2d');
        KB.drawImage(KO, 0, 0, KW.width, KW.height);
        KB.globalCompositeOperation = 'source-in';
        KB.fillStyle = 'rgb(' + Kx + ', ' + Ky + ', ' + KK + ')';
        KB.fillRect(0, 0, KW.width, KW.height);
        KB.globalCompositeOperation = 'source-over';
        if (aW.size >= aB) {
            aW['delete'](aW.keys().next().value);
        }
        aW.set(Ku, KW);
        return KW;
    }
    function as(Kx, Ky, KK, KO=![]) {
        if (!Kx.renderHands)
            return;
        let Ku = Kx.handColor ?? '#6D9EEB';
        let KW = Kx.sz / 58;
        NM.fillStyle = Ku;
        NM.strokeStyle = ir(Ku, 35);
        NM.beginPath();
        let KB = KK;
        if (KO)
            KB = KK + Kx.handY;
        NM.ellipse(Ky * KW, KB * KW, 9 * KW, 7 * KW, 0, 0, Math.PI * 2);
        NM.fill();
        NM.lineWidth = 3 * KW;
        NM.stroke();
    }
    function aZ(Kx, Ky=0, KK=0, KO=0) {
        as(Kx, (-30 * (1 - KO) + Ky * KO) * Kx.facing, (15 + 2 * Math.sin(Date.now() / 300)) * (1 - KO) + KK * KO, !![]);
    }
    function ap(Kx, Ky=0, KK=0, KO=0) {
        as(Kx, (40 * (1 - KO) + Ky * KO) * Kx.facing, (5 + 2 * Math.sin(Date.now() / 300)) * (1 - KO) + KK * KO, !![]);
    }
    function ah(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + Kx.facing * 50, KK, KO);
        let Ku = Kx.weapon.item;
        NM.drawImage(Nc['./images/itemmap.png'], 50 * (Ku % 20), 50 * Math.floor(Ku / 20), 50, 50, -25, -25, 50, 50);
        NM.resetTransform();
    }
    function ag(Kx, Ky, KK, KO) {
        aZ(Kx);
        ap(Kx);
    }
    function ar(Kx, Ky) {
        let KK = Date.now();
        let KO = {
            'left': {
                'x': -30,
                'y': 15 + 2 * Math.sin(KK / 300)
            },
            'right': {
                'x': 40,
                'y': 5 + 2 * Math.sin(KK / 300)
            }
        };
        if (Kx == 0) {
            return KO;
        }
        if (Kx == 1) {
            return {
                'left': {
                    'x': KO.left.x + 25 * Math.sin(KK / 200),
                    'y': -40 + 7 * (Math.cos(KK / 100 + 5 * Math.PI) + 1)
                },
                'right': {
                    'x': KO.right.x,
                    'y': KO.right.y
                }
            };
        }
        if (Kx == 2) {
            let Ku = 30 * Math.sin(KK / 100) + 15;
            return {
                'left': {
                    'x': KO.left.x + Ku,
                    'y': KO.left.y
                },
                'right': {
                    'x': KO.right.x + Ku,
                    'y': KO.right.y
                }
            };
        }
        if (Kx == 3) {
            let KW = 10 * Math.sin(KK / 100) + 15;
            return {
                'left': {
                    'x': KO.left.x + KW,
                    'y': KO.left.y
                },
                'right': {
                    'x': KO.right.x - KW,
                    'y': KO.left.y
                }
            };
        }
        if (Kx == 4) {
            let KB = 20 * Math.sin(KK / 100);
            return {
                'left': {
                    'x': KO.left.x + KB,
                    'y': KO.left.y
                },
                'right': {
                    'x': KO.right.x - KB,
                    'y': KO.right.y
                }
            };
        }
        if (Kx == 5) {
            let Kl = 12 * Math.sin(KK / 250);
            let Ks = 4 * Math.cos(KK / 250);
            return {
                'left': {
                    'x': KO.left.x,
                    'y': KO.left.y
                },
                'right': {
                    'x': KO.right.x + Kl + 20,
                    'y': KO.right.y + Ks + Ky
                }
            };
        }
        if (Kx == 6) {
            return {
                'left': {
                    'x': KO.left.x + 25 * Math.sin(KK / 200),
                    'y': -40 + 7 * (Math.cos(KK / 100 + 5 * Math.PI) + 1)
                },
                'right': {
                    'x': KO.right.x + 25 * Math.sin(KK / 200),
                    'y': -35 + 7 * (Math.cos(KK / 100 + 5 * Math.PI) + 1)
                }
            };
        }
        if (Kx == 7) {
            return {
                'left': {
                    'x': KO.left.x + 25 * Math.sin(KK / 200),
                    'y': -40 + 7 * (Math.cos(KK / 100 + 5 * Math.PI) + 1)
                },
                'right': {
                    'x': KO.right.x - 25 * Math.sin(KK / 200),
                    'y': -35 + 7 * (Math.cos(KK / 100 + 5 * Math.PI) + 1)
                }
            };
        }
        return KO;
    }
    function aD(Kx, Ky, KK, KO, Ku, KW, KB) {
        let Kl = KB.weapon.lastChange;
        let Ks = x0(Date.now() - Kl, 0, 500) / 500;
        Ks = Ks * Ks * (3 - 2 * Ks);
        let KZ = ar(KO.x, KO.y);
        let Kp = ar(KB.weapon.lastEmote, KO.y);
        as(Kx, (KZ.right.x * Ks + Kp.right.x * (1 - Ks)) * Kx.facing, KZ.right.y * Ks + Kp.right.y * (1 - Ks), !![]);
        as(Kx, (KZ.left.x * Ks + Kp.left.x * (1 - Ks)) * Kx.facing, KZ.left.y * Ks + Kp.left.y * (1 - Ks), !![]);
    }
    function aQ(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.translate(Ky, KK);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 712, 292, 36, 83, 25, -55 + KO.y, 36, 83);
        as(Kx, 40, 8 + KO.y);
        NM.resetTransform();
    }
    function aM(Kx, Ky, KK, KO) {
        Gv(Kx, Ky, KK, KO);
        const Ku = ['#c300ff', '#ffd000', '#00d5ff', '#00ff37', '#ff0048'];
        const KW = Date.now();
        const KB = 300;
        const Kl = 100;
        const Ks = Ku[Math.floor(KW / KB) % Ku.length];
        const KZ = Math.floor(KW / Kl);
        const Kp = 60;
        const Kh = 28;
        const Kg = 12;
        let Kr = [];
        for (let KD = 0; KD <= Kh; KD++) {
            const KQ = KD % Kh;
            const KM = KQ / Kh * Math.PI * 2;
            let KY = Math.sin(KZ * 9283 + KQ * 6892) * 43758.5453;
            KY -= Math.floor(KY);
            const KX = Kp + (KY * 2 - 1) * Kg;
            Kr.push({
                'x': Math.cos(KM) * KX,
                'y': Math.sin(KM) * KX
            });
        }
        NM.beginPath();
        NM.moveTo(Kr[0].x, Kr[0].y);
        for (let KE = 1; KE < Kr.length; KE++) {
            NM.lineTo(Kr[KE].x, Kr[KE].y);
        }
        NM.closePath();
        NM.strokeStyle = Ks;
        NM.lineWidth = 7;
        NM.lineCap = 'round';
        NM.lineJoin = 'round';
        NM.stroke();
        NM.beginPath();
        NM.moveTo(Kr[0].x, Kr[0].y);
        for (let Kv = 1; Kv < Kr.length; Kv++) {
            NM.lineTo(Kr[Kv].x, Kr[Kv].y);
        }
        NM.closePath();
        NM.strokeStyle = '#ffffff';
        NM.lineWidth = 2.5;
        NM.stroke();
        NM.scale(KO.facing, 1);
        as(Kx, 40 + KO.x, 8 + KO.y);
    }
    function aY(Kx, Ky, KK, KO) {
        aZ(Kx);
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        NM.fillStyle = Kx.weapon.potion;
        NM.beginPath();
        NM.arc(15, 15, 10, 0, Math.PI * 2, 0);
        NM.fill();
        NM.drawImage(Nc['./images/weapons.png'], 418, 12, 40, 40, 0, -10, 40, 40);
        as(Kx, 5, 20);
        NM.resetTransform();
    }
    function aX(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 46, 20, 14, 40, -7, -40, 14, 40);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function aE(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 467, 0, 32, 61, -12, -60, 32, 61);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function av(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 800, 330, 52, 109, -12, -70, 35, 70);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function ae(Kx, Ky, KK, KO) {
        Gv(Kx, Ky, KK, KO);
        NM.rotate(Math.PI / 2);
        NM.drawImage(Nc['./images/weapons.png'], 360, 0, 58, 62, -58 / 2, -62 / 2 - 55, 58, 62);
        as(Kx, 30, -30);
        as(Kx, -30, -30);
        NM.resetTransform();
    }
    function aL(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 24, 0, 20, 60, -12, -60, 20, 60);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function aS(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 167, 474, 26, 71, -12, -71, 26, 71);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function aA(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 230, 474, 26, 71, -12, -71, 26, 71);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function ak(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        as(Kx, 32, 16);
        NM.drawImage(Nc['./images/weapons.png'], 717, 531, 275, 26, 10, -5, 275, 26);
        as(Kx, 11, 20);
        NM.resetTransform();
    }
    function ao(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 197, 473, 32, 72, -16, -72, 32, 72);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function aT(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 186, 0, 28, 60, -14, -60, 28, 60);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function aJ(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 214, 0, 28, 60, -14, -60, 28, 60);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function ad(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 0, 0, 22, 60, -11, -60, 22, 60);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function aw(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 246, 0, 25, 60, -11, -60, 22, 60);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function aP(Kx, Ky, KK, KO) {
        let Ku = 'rgb(' + (Math.sin(Nq.GAME_TICK / 30) * 127 + 127) + ',' + (Math.cos(Nq.GAME_TICK / 30 + 15) * 127 + 127) + ',' + (Math.cos(Nq.GAME_TICK / 30) * 127 + 127) + ')';
        NM.translate(Ky, KK);
        Ge(Kx, Ky + KO.facing * 20, KK, {
            ...KO,
            'y': 0
        });
        NM.fillStyle = Ku;
        NM.beginPath();
        NM.arc(20, 0, KO.y / 6 + 5, 0, Math.PI * 2);
        NM.fill();
        NM.drawImage(Nc['./images/weapons.png'], 697, 657, 98, 72, -5, -40, 96, 75);
        as(Kx, 7, 33);
        as(Kx, -50, 10);
        NM.resetTransform();
    }
    function aH(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        as(Kx, 20, 4);
        NM.drawImage(Nc['./images/weapons.png'], 424, 110, 67, 20, 0, 0, 67, 20);
        as(Kx, 4, 20);
        NM.resetTransform();
    }
    function at(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        let Ku = KO.angle % 180 - 90;
        NM.rotate(Ku * Math.PI / 180);
        if (KO.angle > 180)
            NM.scale(-1, 1);
        const KW = 949
          , KB = 965
          , Kl = 70
          , Ks = 58;
        const KZ = 120
          , Kp = 144;
        NM.drawImage(Nc['./images/weapons.png'], KW, KB, Kl, Ks, 10, -72, KZ, Kp);
        as(Kx, 10, 0);
        NM.resetTransform();
    }
    function aV(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        as(Kx, 80, 15);
        NM.drawImage(Nc['./images/weapons.png'], 200, 287, 196, 58, 0, -25, 180, 58);
        as(Kx, 24, 14);
        NM.resetTransform();
    }
    function aj(Kx, Ky, KK, KO) {
        aZ(Kx);
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        NM.drawImage(Nc['./images/weapons.png'], 425, 226, 71, 26, 0, 0, 71, 26);
        as(Kx, 18, 17);
        NM.resetTransform();
    }
    function ac(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + KO.facing * 20, KK, KO);
        as(Kx, 40, 25);
        NM.drawImage(Nc['./images/weapons.png'], 438, 426, 62, 34, 0, 0, 62, 34);
        as(Kx, 18, 25);
        NM.resetTransform();
    }
    function aq(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        as(Kx, 32, 16);
        NM.drawImage(Nc['./images/weapons.png'], 413, 85, 87, 18, 0, 0, 87, 18);
        as(Kx, 11, 20);
        NM.resetTransform();
    }
    function ab(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + 25 * KO.facing, KK + 20, KO);
        as(Kx, 32, -4);
        NM.drawImage(Nc['./images/weapons.png'], 430, 65, 70, 20, 0, -20, 70, 20);
        as(Kx, 11, 0);
        NM.resetTransform();
    }
    function aF(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + 25 * KO.facing, KK + 20, KO);
        as(Kx, 32, -4);
        NM.drawImage(Nc['./images/weapons.png'], 435, 530, 95, 35, 0, -30, 100, 35);
        as(Kx, 11, 0);
        NM.resetTransform();
    }
    function aU(Kx, Ky, KK, KO, Ku, KW) {
        aZ(Kx);
        Ge(Kx, Ky + 25 * KO.facing, KK + 20, KO);
        as(Kx, 24, -3);
        NM.drawImage(Nc['./images/weapons.png'], 447, 345, 50, 17, 0, -20, 50, 17);
        NM.resetTransform();
        ip(Kx.x + 50 * KO.facing, Kx.y - 10, Ku, 26, KW);
    }
    function aC(Kx, Ky, KK, KO) {
        Ge(Kx, Ky + 25 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 439, 258, 58, 83, 0, -60, 58, 83);
        as(Kx, 14, -7);
        as(Kx, 44, 7);
        NM.resetTransform();
    }
    function az(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.rotate((KO.angle - 90) * Math.PI / 180);
        NM.drawImage(Nc['./images/weapons.png'], 407, 140, 92, 32, 22, -16, 92, 32);
        as(Kx, 22, 14);
        as(Kx, 24, 18);
        NM.resetTransform();
    }
    function af(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.rotate((KO.angle - 90) * Math.PI / 180);
        NM.drawImage(Nc['./images/weapons.png'], 205, 348, 60, 121, 30, -60, 60, 121);
        NM.strokeStyle = '#EA9999';
        NM.lineWidth = 3;
        for (let Ku = 0; Ku < 2; Ku++) {
            NM.beginPath();
            NM.moveTo(40, -50);
            NM.quadraticCurveTo(40 - KO.x, 0, 40, 50);
            NM.stroke();
            NM.strokeStyle = 'white';
            NM.lineWidth = 1;
        }
        as(Kx, 40 - KO.x / 2, 0);
        as(Kx, 80, 20);
        NM.resetTransform();
    }
    function aR(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.translate(Ky, KK);
        NM.scale(Kx.facing, 1);
        NM.translate(45, 5);
        NM.drawImage(Nc['./images/weapons.png'], 77, 962, 39, 42, -39 / 2, -42 / 2, 39, 42);
        as(Kx, 0, 20);
        NM.resetTransform();
    }
    function am(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.translate(Ky, KK);
        NM.scale(Kx.facing, 1);
        NM.translate(45, 5);
        NM.drawImage(Nc['./images/weapons.png'], 33, 960, 39, 42, -39 / 2, -42 / 2, 39, 42);
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function an(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.rotate((KO.angle - 90) * Math.PI / 180);
        NM.drawImage(Nc['./images/weapons.png'], 502, 246, 92, 124, 10, -124 / 2, 92, 124);
        NM.strokeStyle = '#ceb41e';
        NM.lineWidth = 4;
        for (let Ku = 0; Ku < 2; Ku++) {
            NM.beginPath();
            NM.moveTo(40, -50);
            NM.quadraticCurveTo(40 - KO.x, 0, 40, 50);
            NM.stroke();
            NM.strokeStyle = 'white';
            NM.lineWidth = 1;
        }
        NM.resetTransform();
    }
    function G0(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.rotate(KO.angle * Math.PI / 180);
        as(Kx, -5, -70 - KO.x);
        NM.drawImage(Nc['./images/weapons.png'], 164, 292, 34, 152, -34 / 2, -152 - 30 - 10 - KO.x, 34, 152);
        as(Kx, 5, -100 - KO.x);
        NM.resetTransform();
    }
    function G1(Kx, Ky, KK, KO, Ku, KW) {
        let KB = Date.now();
        let Kl = Math.floor(KB / 100 % 3);
        KO.x -= 40;
        NM.translate(Ky, KK);
        as(Kx, (KO.x + 5) * KO.facing, 5);
        as(Kx, (KO.x + 30) * KO.facing, 0);
        if (!Kx.weapon.e) {
            Ge(Kx, Ky + KO.facing * 30, KK, KO);
            NM.drawImage(Nc['./images/weapons.png'], 830, 173, 160, 52, KO.x, -10, 152, 34);
            if (Kl === 0) {
                NM.drawImage(Nc['./images/weapons.png'], 820, 7, 189, 50, 160 + KO.x, -45, 300, 90);
                NM.resetTransform();
            } else if (Kl === 1) {
                NM.drawImage(Nc['./images/weapons.png'], 820, 56, 189, 45, 160 + KO.x, -45, 300, 90);
                NM.resetTransform();
            } else if (Kl === 2) {
                NM.drawImage(Nc['./images/weapons.png'], 820, 104, 189, 50, 160 + KO.x, -45, 300, 90);
                NM.resetTransform();
            }
        } else {
            Ge(Kx, Ky + KO.facing * 30, KK, KO);
            NM.drawImage(Nc['./images/weapons.png'], 830, 173, 160, 52, KO.x, -10, 152, 34);
            NM.resetTransform();
        }
        NM.resetTransform();
    }
    function G2(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.rotate((KO.angle - 90) * Math.PI / 180);
        NM.drawImage(Nc['./images/weapons.png'], 394, 362, 106, 22, 26, -6, 106, 22);
        NM.resetTransform();
    }
    function G3(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 643, 311, 27, 57, -13.5, -57, 27, 57);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function G4(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 40 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 672, 294, 30, 78, -15, -70, 30, 78);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function G5(Kx, Ky, KK, KO, Ku, KW) {
        aZ(Kx);
        Gv(Kx, Ky + 20 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 704, 41, 53, 54, KO.x, -25, 53, 54);
        NM.resetTransform();
    }
    function G6(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.translate(Ky, KK);
        let Ku = KO.angle % 180 - 90;
        NM.rotate(Ku * Math.PI / 180);
        if (KO.angle > 180)
            NM.scale(-1, 1);
        NM.drawImage(Nc['./images/weapons.png'], 455, 386, 45, 30, 25, -6, 45, 30);
        as(Kx, 40, 16);
        NM.resetTransform();
    }
    function G7(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        let Ku = KO.angle % 180 - 90;
        NM.rotate(Ku * Math.PI / 180);
        if (KO.angle > 180)
            NM.scale(-1, 1);
        NM.drawImage(Nc['./images/weapons.png'], 504, 185, 260, 60, 25, -30, 260, 60);
        NM.resetTransform();
    }
    function G8(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        let Ku = KO.angle % 180 - 90;
        NM.rotate(Ku * Math.PI / 180);
        if (KO.angle > 180)
            NM.scale(-1, 1);
        as(Kx, 80, 11);
        NM.drawImage(Nc['./images/weapons.png'], 394, 171, 104, 55, 22, -27, 104, 55);
        as(Kx, 40, 16);
        NM.resetTransform();
    }
    function G9(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.translate(Ky, KK);
        let Ku = KO.angle % 180 - 90;
        NM.rotate(Ku * Math.PI / 180);
        if (KO.angle > 180)
            NM.scale(-1, 1);
        NM.drawImage(Nc['./images/weapons.png'], 1, 421, 150, 54, -65, -27, 150, 54);
        as(Kx, 35, 15);
        NM.resetTransform();
    }
    function GI(Kx, Ky, KK, KO) {
        aZ(Kx);
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        NM.drawImage(Nc['./images/weapons.png'], 638, 572, 144, 87, -90, -40, 150, 70);
        as(Kx, 35, 15);
        NM.resetTransform();
    }
    function Ga(Kx, Ky, KK, KO) {
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        NM.translate(Ky, KK);
        NM.rotate((KO.angle - 90) * Math.PI / 180);
        as(Kx, 70 + KO.x, -5);
        NM.fillStyle = '#444';
        NM.fillRect(KO.x + 40, -2, 110, 4);
        NM.fillStyle = KO.color;
        NM.lineWidth = 3;
        NM.strokeStyle = ir(KO.color, 40);
        ia(Ku(145, -10), Ku(180, -5), Ku(190, 0), Ku(180, 5), Ku(145, 10), Ku(140, 0));
        as(Kx, 100 + KO.x, 5);
        NM.resetTransform();
    }
    function GG(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.rotate((KO.angle + 180) * Math.PI / 180);
        let Ku = Nc['./images/plasmaCannon.png'];
        NM.drawImage(Ku, -Ku.width / 2, -117);
        NM.resetTransform();
    }
    function Gi(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 25 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 0, 63, 22, 60, -11, -40, 22, 60);
        as(Kx, KO.x, -10);
        NM.resetTransform();
    }
    function GN(Kx, Ky, KK, KO) {
        aZ(Kx);
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        as(Kx, 5, 20);
        NM.drawImage(Nc['./images/weapons.png'], 450, 620, 95, 54, -30, 10, 60, 28);
        as(Kx, 5, 20);
        NM.resetTransform();
    }
    function Gx(Kx, Ky, KK, KO) {
        aZ(Kx);
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        as(Kx, 5, 20);
        NM.drawImage(Nc['./images/weapons.png'], 506, 132, 61, 34, -30, 10, 60, 28);
        as(Kx, 5, 20);
        NM.resetTransform();
    }
    function Gy(Kx, Ky, KK, KO) {
        aZ(Kx);
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        as(Kx, 5, 20);
        NM.drawImage(Nc['./images/weapons.png'], 785, 610, 47, 42, -23.5, -21, 47, 42);
        as(Kx, 5, 20);
        NM.resetTransform();
    }
    function GK(Kx, Ky, KK, KO) {
        aZ(Kx);
        Ge(Kx, Ky + KO.facing * 30, KK, KO);
        as(Kx, 5, 20);
        NM.drawImage(Nc['./images/weapons.png'], 709, 675, 143, 62, -23.5, -21, 143, 62);
        as(Kx, 5, 20);
        NM.resetTransform();
    }
    function GO(Kx, Ky, KK, KO) {
        aZ(Kx);
        GB(Kx, Ky, KK, KO, '#232b22', '#3f543c', 18);
    }
    function Gu(Kx, Ky, KK, KO) {
        aZ(Kx);
        GB(Kx, Ky, KK, KO, '#68b22c', '#88e83a', 15);
    }
    function GW(Kx, Ky, KK, KO) {
        GB(Kx, Ky, KK, KO, '#3e3eb2', '#5555FF', 20);
    }
    function GB(Kx, Ky, KK, KO, Ku, KW, KB) {
        NM.translate(Ky, KK);
        NM.scale(Kx.facing, 1);
        NM.fillStyle = Ku;
        NM.beginPath();
        NM.arc(45, 10, KB, 0, Math.PI * 2);
        NM.fill();
        NM.fillStyle = KW;
        NM.beginPath();
        NM.arc(45, 10, KB - 3, 0, Math.PI * 2);
        NM.fill();
        NM.resetTransform();
    }
    function Gl(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.scale(Kx.facing, 1);
        as(Kx, 40 + KO.x, 15);
        NM.lineWidth = 3;
        NM.fillStyle = '#686868';
        NM.strokeStyle = 'gray';
        NM.beginPath();
        NM.rect(32 + KO.x, 0, 10, 25);
        NM.stroke();
        NM.fill();
        NM.beginPath();
        NM.rect(32 + KO.x, 2, 100, 8);
        NM.stroke();
        NM.fill();
        NM.beginPath();
        NM.rect(46 + KO.x, -10, 5, 10);
        NM.stroke();
        NM.fill();
        NM.beginPath();
        NM.rect(40 + KO.x, -10, 25, 5);
        NM.stroke();
        NM.fill();
        if (KO.e) {
            NM.fillStyle = KO.color;
            NM.fillRect(34 + KO.x, 10, 6, 12);
        }
        as(Kx, 70 + KO.x, 13);
        NM.resetTransform();
    }
    function Gs(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.translate(Ky, KK);
        NM.scale(Kx.facing, 1);
        as(Kx, 42 + KO.x, 15);
        NM.lineWidth = 3;
        NM.fillStyle = '#686868';
        NM.strokeStyle = 'gray';
        NM.beginPath();
        NM.rect(32 + KO.x, 0, 10, 25);
        NM.stroke();
        NM.fill();
        NM.beginPath();
        NM.rect(32 + KO.x, 0, 40, 10);
        NM.stroke();
        NM.fill();
        if (KO.e) {
            NM.fillStyle = KO.color;
            NM.fillRect(34 + KO.x, 10, 6, 12);
        }
        NM.resetTransform();
    }
    function GZ(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.scale(Kx.facing, 1);
        as(Kx, 60, 0);
        NM.lineWidth = 3;
        NM.fillStyle = '#888';
        NM.strokeStyle = '#777';
        NM.beginPath();
        NM.rect(50 + KO.x, 0, 20, 20);
        NM.stroke();
        NM.fill();
        NM.beginPath();
        NM.rect(32 + KO.x, 0, 60, 16);
        NM.stroke();
        NM.fill();
        NM.fillStyle = '#777';
        NM.fillRect(50 + KO.x, 0, 20, 16);
        if (KO.e) {
            NM.fillStyle = '#991111';
            NM.strokeStyle = '#770505';
            NM.beginPath();
            NM.moveTo(92, -3);
            NM.lineTo(105, 8);
            NM.lineTo(92, 19);
            NM.stroke();
            NM.fill();
        }
        as(Kx, 32, 15);
        NM.resetTransform();
    }
    function Gp(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 50 * KO.facing, KK + 20, KO);
        NM.drawImage(Nc['./images/weapons.png'], 580, 40, 45, 50, -20, -40, 40, 45);
        as(Kx, 0, -10);
        NM.resetTransform();
    }
    function Gh(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 45 * KO.facing, KK + 5, KO);
        NM.drawImage(Nc['./images/weapons.png'], 623, 46, 19, 64, -15, -40, 20, 60);
        as(Kx, 0, 10);
        NM.resetTransform();
    }
    function Gg(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + 45 * KO.facing, KK - 15, KO);
        NM.drawImage(Nc['./images/weapons.png'], 595, 101, 16, 66, -15, -40, 25, 80);
        as(Kx, 0, 10);
        NM.resetTransform();
    }
    function Gr(Kx, Ky, KK, KO) {
        const Ku = (KO.u ?? 0) & 3;
        const KW = ((KO.u ?? 0) & 4) !== 0;
        const KB = (KO.angle - 90) * Math.PI / 180;
        const Kl = Math.cos(KB) * 60;
        const Ks = Math.sin(KB) * 60;
        const KZ = [{
            'sx': 507,
            'sy': 0,
            'sw': 68,
            'sh': 20,
            'dw': 80,
            'dh': 30
        }, {
            'sx': 507,
            'sy': 20,
            'sw': 68,
            'sh': 20,
            'dw': 80,
            'dh': 30
        }, {
            'sx': 597,
            'sy': 0,
            'sw': 86,
            'sh': 20,
            'dw': 101,
            'dh': 30
        }, {
            'sx': 597,
            'sy': 20,
            'sw': 111,
            'sh': 20,
            'dw': 131,
            'dh': 30
        }];
        NM.translate(Ky, KK);
        if (Ku > 0) {
            for (let Kp = 0; Kp < Ku; Kp++) {
                const Kh = KB + Math.PI + (Kp - (Ku - 1) / 2) * (30 * Math.PI / 180);
                const Kg = Math.cos(Kh) * 95;
                const Kr = Math.sin(Kh) * 95;
                const KD = Kl - Kg;
                const KQ = Ks - Kr;
                NM.save();
                NM.translate(Kg, Kr);
                NM.rotate(Math.atan2(KQ, KD));
                NM.drawImage(Nc['./images/weapons.png'], 507, 0, 68, 20, -80 / 2, -30 / 2, 80, 30);
                NM.restore();
            }
        }
        aZ(Kx);
        if (KW) {
            ap(Kx);
        } else {
            const KM = KZ[Ku];
            NM.save();
            NM.rotate(KB);
            NM.drawImage(Nc['./images/weapons.png'], KM.sx, KM.sy, KM.sw, KM.sh, 25 + KO.x, -15, KM.dw, KM.dh);
            as(Kx, 38 + KO.x, 0);
            NM.restore();
        }
        NM.resetTransform();
    }
    function GD(Kx, Ky, KK, KO, Ku, KW) {
        Gv(Kx, Ky + -10 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        if (KO.attackProgress < 25) {
            const KB = Date.now() * 0.01 % (Math.PI * 2);
            const Kl = KO.x + KO.facing * 15;
            const Ks = 0;
            NM.translate(Kl, Ks);
            NM.rotate(KB);
            NM.drawImage(Nc['./images/weapons.png'], 524, 45, 45, 65, -15, -25, 30, 50);
            NM.rotate(-KB);
            NM.translate(-Kl, -Ks);
        } else {
            NM.drawImage(Nc['./images/weapons.png'], 524, 45, 45, 65, KO.x, -25, 30, 50);
        }
        NM.resetTransform();
    }
    function G5(Kx, Ky, KK, KO, Ku, KW) {
        Gv(Kx, Ky + 20 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        aZ(Kx);
        NM.drawImage(Nc['./images/weapons.png'], 704, 41, 53, 54, KO.x, -25, 53, 54);
        as(Kx, 0, 10);
        NM.resetTransform();
    }
    function GQ(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        aZ(Kx);
        NM.scale(Kx.facing, 1);
        NM.fillStyle = '#666';
        NM.fillRect(30, -58, 5, 70);
        NM.fillStyle = KO.color;
        NM.strokeStyle = ir(KO.color, 30);
        NM.beginPath();
        NM.lineWidth = 2;
        if (!Kx.weapon.u) {
            NM.arc(30, -50, 50, Math.PI, Math.PI * 2);
        } else {
            NM.moveTo(17 + 2, -30);
            NM.lineTo(30 + 2, -100);
            NM.lineTo(43 + 2, -30);
            NM.lineTo(30 + 2, -35);
        }
        NM.fill();
        NM.closePath();
        NM.stroke();
        NM.lineWidth = 5;
        NM.strokeStyle = '#666';
        NM.lineCap = 'round';
        NM.beginPath();
        NM.arc(40, 12, 8, 0, Math.PI);
        NM.stroke();
        as(Kx, 35, 2);
        NM.resetTransform();
    }
    function GM(Kx, Ky, KK, KO, Ku, KW) {
        Gv(Kx, Ky, KK, KO);
        NM.scale(KO.facing, 1);
        NM.lineWidth = 4;
        NM.strokeStyle = 'orange';
        NM.beginPath();
        NM.moveTo(0, 0);
        NM.quadraticCurveTo(Math.round(KO.x / 2), Math.round(KO.x / 6), KO.x, KO.y);
        NM.stroke();
        NM.resetTransform();
        let KB = (KO.facing * -90 + KO.angle * KO.facing) * Math.PI / 180;
        ip(Kx.x + KO.facing * Math.round(KO.x * Math.cos(KB)), Kx.y + KO.facing * Math.round(KO.x * Math.sin(KB)), Ku, 40, KW);
    }
    function GY(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.strokeStyle = '#877557';
        NM.fillStyle = '#877557';
        GE(Kx, Ky, KK, KO, 0);
        as(Kx, 15, -25);
        NM.resetTransform();
    }
    function GX(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.strokeStyle = '#4996d1';
        NM.fillStyle = '#4996d1';
        GE(Kx, Ky, KK, KO, 10);
        NM.fillStyle = 'yellow';
        NM.beginPath();
        NM.arc(-30, -14, 5, 0, Math.PI * 2);
        NM.fill();
        NM.beginPath();
        NM.arc(30, -14, 5, 0, Math.PI * 2);
        NM.fill();
        as(Kx, 15, -35);
        NM.resetTransform();
    }
    function GE(Kx, Ky, KK, KO, Ku) {
        NM.translate(Ky + 20 * Kx.facing, KK);
        NM.scale(Kx.facing, 1);
        NM.rotate(KO.angle * Math.PI / 180);
        NM.lineWidth = 5;
        NM.beginPath();
        NM.arc(0, -3, 25 + Ku, Math.PI + Math.PI / 7, 0 - Math.PI / 7);
        NM.stroke();
        NM.lineWidth = 3;
        NM.strokeStyle = '#FFFFFF';
        NM.beginPath();
        NM.moveTo(-20 - Ku, -14);
        NM.lineTo(20 + Ku, -14);
        NM.stroke();
    }
    function Gv(Kx, Ky, KK, KO) {
        NM.lineWidth = 3;
        NM.translate(Ky, KK);
        NM.rotate((KO.facing * -90 + KO.angle * KO.facing) * Math.PI / 180);
        NM.fillStyle = KO.color;
        NM.strokeStyle = KO.color;
    }
    function Ge(Kx, Ky, KK, KO) {
        NM.translate(Ky + KO.x * KO.facing, KK + KO.y);
        NM.scale(KO.facing, 1);
        NM.rotate((-90 + KO.angle) * Math.PI / 180);
        NM.fillStyle = KO.color;
        NM.strokeStyle = KO.color;
    }
    function GL(Kx, Ky, KK, KO) {
        aZ(Kx);
        let Ku = (Kl, Ks) => {
            return {
                'x': Kl + KO.x,
                'y': Ks + KO.y
            };
        }
        ;
        Gv(Kx, Ky + 30 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        let KW = [Ku(0, 10), Ku(7, -7), Ku(10, -9), Ku(13, -11), Ku(40, -15), Ku(58, -15), Ku(64, -13), Ku(68, -10), Ku(70, 15), Ku(65, 20), Ku(35, 20), Ku(24, 10)];
        let KB = [Ku(15, 3), Ku(55, 3), Ku(60, 16), Ku(15, 16)];
        NM.strokeStyle = ir(KO.color, 30);
        NM.lineWidth = 4;
        ia(...KW);
        ia(...KB);
        NM.resetTransform();
    }
    function GS(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + -10 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 803, 240, 135, 90, KO.x + 40, -50, 135, 90);
        NM.resetTransform();
    }
    function GA(Kx, Ky, KK, KO) {
        Gv(Kx, Ky, KK + 25, KO);
        NM.scale(KO.facing, 1);
        as(Kx, 0, -10);
        NM.lineWidth = 2;
        NM.strokeStyle = ir(KO.color, 30);
        NM.fillStyle = '#666';
        NM.fillRect(-3, 0, 6, -130);
        NM.beginPath();
        NM.moveTo(-10, -140);
        NM.quadraticCurveTo(45, -140, 70, -105);
        NM.quadraticCurveTo(30, -115, -10, -115);
        NM.lineTo(-35, -130);
        NM.closePath();
        NM.fillStyle = KO.color;
        NM.fill();
        NM.stroke();
        as(Kx, 0, -40);
        NM.resetTransform();
    }
    function Gk(Kx, Ky, KK, KO) {
        aZ(Kx);
        ap(Kx);
        return;
        let Ku = [];
        let KW = (KB, Kl) => {
            return {
                'x': KB + KO.x,
                'y': Kl + KO.y
            };
        }
        ;
        Gv(Kx, Ky, KK, KO);
        NM.scale(KO.facing, 1);
        ia(KW(-50, 25), KW(50, 25), KW(50, 40), KW(-50, 40));
        NM.resetTransform();
    }
    function Go(Kx, Ky, KK, KO) {
        aZ(Kx);
        ap(Kx);
        Gv(Kx, Ky, KK, KO);
        let Ku = Kx.sz / 2 + 60;
        NM.beginPath();
        NM.moveTo(-8 + Ku, -24);
        NM.quadraticCurveTo(20 + Ku, 0, -8 + Ku, 24);
        NM.quadraticCurveTo(Ku, 0, -8 + Ku, -24);
        NM.fillStyle = ir(KO.color, 20);
        NM.stroke();
        NM.fill();
        NM.rotate(Math.PI);
        NM.beginPath();
        NM.moveTo(-8 + Ku, -24);
        NM.quadraticCurveTo(20 + Ku, 0, -8 + Ku, 24);
        NM.quadraticCurveTo(Ku, 0, -8 + Ku, -24);
        NM.fillStyle = ir(KO.color, 20);
        NM.stroke();
        NM.fill();
        NM.resetTransform();
    }
    function GT(Kx, Ky, KK, KO) {
        aZ(Kx);
        ap(Kx);
        Gv(Kx, Ky, KK, KO);
        let Ku = Kx.sz / 2 + 60;
        function KW() {
            NM.beginPath();
            NM.moveTo(-8 + Ku, -24);
            NM.quadraticCurveTo(20 + Ku, 0, -8 + Ku, 24);
            NM.quadraticCurveTo(Ku, 0, -8 + Ku, -24);
            NM.fillStyle = ir(KO.color, 20);
            NM.stroke();
            NM.fill();
        }
        NM.save();
        KW();
        NM.restore();
        NM.save();
        NM.rotate(Math.PI);
        KW();
        NM.restore();
        NM.save();
        NM.rotate(Math.PI / 2);
        KW();
        NM.restore();
        NM.resetTransform();
    }
    function GJ(Kx, Ky, KK, KO) {
        aZ(Kx);
        ap(Kx);
        Gv(Kx, Ky, KK, KO);
        let Ku = Kx.sz / 2 + 60;
        NM.beginPath();
        NM.moveTo(-8 + Ku, -24);
        NM.quadraticCurveTo(20 + Ku, 0, -8 + Ku, 24);
        NM.quadraticCurveTo(Ku, 0, -8 + Ku, -24);
        NM.fillStyle = ir(KO.color, 20);
        NM.stroke();
        NM.fill();
        NM.resetTransform();
    }
    function Gd(Kx, Ky, KK, KO) {
        aZ(Kx);
        ap(Kx);
        Gv(Kx, Ky, KK, KO);
        const Ku = 3;
        const KW = Math.PI * 2 / 10;
        const KB = KO.x;
        NM.fillStyle = ir(KO.color, 20);
        NM.lineWidth = 2;
        for (let Kl = 0; Kl < Ku; Kl++) {
            const Ks = (Kl - Math.floor(Ku / 2)) * KW;
            const KZ = Ky + Math.cos(Ks) * KB;
            const Kp = KK + Math.sin(Ks) * KB;
            NM.beginPath();
            NM.arc(KZ, Kp, 6, 0, Math.PI * 2);
            NM.fill();
            NM.stroke();
        }
        NM.resetTransform();
    }
    function Gw(Kx, Ky, KK, KO) {
        aZ(Kx);
        ap(Kx);
        Gv(Kx, Ky, KK, KO);
        const Ku = Kx.weapon;
        const KW = 3;
        const KB = Math.PI * 2 / 10;
        const Kl = KO.x;
        for (let Kg = 0; Kg < KW; Kg++) {
            const Kr = (Kg - Math.floor(KW / 2)) * KB;
            const KD = Ky + Math.cos(Kr) * Kl;
            const KQ = KK + Math.sin(Kr) * Kl;
            NM.beginPath();
            NM.arc(KD, KQ, 6, 0, Math.PI * 2);
            NM.fillStyle = ir(KO.color, 20);
            NM.fill();
            NM.stroke();
        }
        const Ks = (1 - Math.floor(KW / 2)) * KB;
        const KZ = Ks + Math.PI;
        const Kp = Ky + Math.cos(KZ) * Kl;
        const Kh = KK + Math.sin(KZ) * Kl;
        NM.beginPath();
        NM.arc(Kp, Kh, 8, 0, Math.PI * 2);
        NM.fillStyle = ir(KO.color, 40);
        NM.fill();
        NM.stroke();
        NM.resetTransform();
    }
    function GP(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.rotate(KO.angle * Math.PI / 180);
        as(Kx, 0, -40 - KO.x);
        if (KO.e) {
            let Ku = Date.now();
            let KW = Math.floor(Ku / 100 % 3);
            if (KW === 0) {
                NM.drawImage(Nc['./images/weapons.png'], 548, 566, 28, 80, -11, -120 - KO.x, 28, 80);
            } else if (KW === 1) {
                NM.drawImage(Nc['./images/weapons.png'], 576, 566, 28, 80, -11, -120 - KO.x, 28, 80);
            } else if (KW === 2) {
                NM.drawImage(Nc['./images/weapons.png'], 604, 566, 28, 80, -11, -120 - KO.x, 28, 80);
            }
        }
        NM.drawImage(Nc['./images/weapons.png'], 449, 680, 22, 69, -22 / 2, -100 - KO.x, 22, 69);
        aZ(Kx);
        NM.resetTransform();
    }
    function GH(Kx, Ky, KK, KO) {
        NM.translate(Ky, KK);
        NM.rotate(KO.angle * Math.PI / 180);
        as(Kx, -5, -70 - KO.x);
        if (KO.e) {
            let Ku = Date.now();
            let KW = Math.floor(Ku / 100 % 3);
            if (KW === 0) {
                NM.drawImage(Nc['./images/weapons.png'], 548, 566, 28, 80, -14, -210 - KO.x, 34, 80);
            } else if (KW === 1) {
                NM.drawImage(Nc['./images/weapons.png'], 576, 566, 28, 80, -14, -210 - KO.x, 34, 80);
            } else if (KW === 2) {
                NM.drawImage(Nc['./images/weapons.png'], 604, 566, 28, 80, -14, -210 - KO.x, 34, 80);
            }
        }
        if (KO.angle > 180)
            NM.scale(-1, 1);
        NM.drawImage(Nc['./images/weapons.png'], 480, 672, 32, 141, -32 / 2, -152 - 30 - 10 - KO.x, 32, 180);
        as(Kx, 5, -100 - KO.x);
        NM.resetTransform();
    }
    function Gt(Kx, Ky, KK, KO, Ku, KW) {
        aZ(Kx);
        NM.save();
        NM.translate(Ky, KK);
        NM.rotate(KO.angle * Math.PI / 180);
        NM.drawImage(Nc['./images/weapons.png'], 375, 585, 45, 45, -30, -KO.x - 85, 60, 60);
        NM.restore();
        const KB = Kx.weapon.circulatingProjectiles;
        if (KB && KB.length > 0 && Ku) {
            const Kl = KO.angle * Math.PI / 180;
            const Ks = Kx.x + (KO.x + 55) * Math.sin(Kl);
            const KZ = Kx.y - (KO.x + 55) * Math.cos(Kl);
            NM.resetTransform();
            for (const Kp of KB) {
                const Kh = Kp.a * Math.PI / 180;
                const Kg = Kp.a + 90 * (Kp.dir ?? 1);
                iK({
                    't': Kp.t,
                    'r': Kp.r,
                    'c': Kp.c,
                    'x': Ks + Math.cos(Kh) * 30,
                    'y': KZ + Math.sin(Kh) * 30,
                    'a': Kg
                }, Ku, KW);
            }
        }
        NM.resetTransform();
    }
    function GV(Kx, Ky, KK, KO) {
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky + -10 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        as(Kx, -15 + KO.x, 15);
        ia(Ku(-15 - KO.x, 18), Ku(35 - KO.x, 18), Ku(35 - KO.x, 13), Ku(-15 - KO.x, 13));
        NM.fillStyle = 'gray';
        NM.fillRect(0, 0, 0, 0);
        NM.drawImage(Nc['./images/weapons.png'], 644, 443, 210, 91, KO.x + 5, KO.y - 35, 210, 91);
        NM.drawImage(Nc['./images/weapons.png'], 571, 463, 71, 75, -KO.x - 55, KO.y - 15, 71, 75);
        as(Kx, 35 + KO.x, 15);
        NM.resetTransform();
    }
    function Gj(Kx, Ky, KK, KO) {
        aZ(Kx);
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky + 35 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        ia(Ku(23 - 20, 5 - 20), Ku(30 - 20, 5 - 20), Ku(40 - 20, -4 + 5 - 20), Ku(30 - 20, -1 + 5 - 20), Ku(23 - 20, -1 + 5 - 20), Ku(13 - 20, -4 + 5 - 20));
        ia(Ku(23 - 20, -15), Ku(25 - 20, -40 + 5 - 20), Ku(26.5 - 20, -43 + 5 - 20), Ku(28 - 20, -40 + 5 - 20), Ku(30 - 20, 0 + 5 - 20));
        NM.fillStyle = '#888888';
        NM.fillRect(24 + KO.x - 20, 0 + KO.y + 7 - 20, 5, 15);
        as(Kx, 5, -3);
        NM.resetTransform();
    }
    function Gc(Kx, Ky, KK, KO) {
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky + -45 * KO.facing, KK + 30, KO);
        NM.scale(KO.facing, 1);
        NM.lineWidth = 5;
        NM.strokeStyle = ir(KO.color, 40);
        NM.fillStyle = ir(KO.color, 10);
        ia(Ku(23 - 20 - 15, -15), Ku(25 - 20 - 15, -40 + 5 - 140), Ku(26.5 - 20, -43 + 5 - 180), Ku(28 - 20 + 15, -40 + 5 - 140), Ku(30 - 20 + 15, 0 + 5 - 20));
        NM.fillStyle = KO.color;
        ia(Ku(23 - 20 - 10, -15), Ku(25 - 20, -40 + 5 - 130), Ku(26.5 - 20, -43 + 5 - 180), Ku(28 - 20, -40 + 5 - 130), Ku(30 - 20 + 10, 0 + 5 - 20));
        ia(Ku(3 * 3 - 13, (5 - 20) * 5 + 60), Ku(30 - 13, -15 * 5 + 60), Ku(20 * 3 - 13, (-4 + 5 - 20) * 5 + 60), Ku(10 * 3 - 13, (-1 + 5 - 20) * 5 + 60), Ku(3 * 3 - 13, (-1 + 5 - 20) * 5 + 60), Ku(-7 * 3 - 13, (-4 + 5 - 20) * 5 + 60));
        NM.fillStyle = '#555';
        NM.fillRect(24 + KO.x - 20, 0 + KO.y + 7 - 20, 10, 15);
        as(Kx, 4, 0);
        as(Kx, 8, 4);
        NM.resetTransform();
    }
    function Gq(Kx, Ky, KK, KO) {
        aZ(Kx);
        NM.strokeStyle = 'gray';
        NM.fillStyle = '#b2b2b2';
        NM.lineWidth = 2;
        NM.beginPath();
        NM.arc(40 * Kx.facing + Ky, KK, 58 / 1.5, -Math.PI / 2 * Kx.facing, Math.PI / 2 * Kx.facing);
        NM.closePath();
        NM.fill();
        NM.stroke();
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky + 35 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        ia(Ku(23 - 20, 5 - 20), Ku(30 - 20, 5 - 20), Ku(40 - 20, -4 + 5 - 20), Ku(30 - 20, -1 + 5 - 20), Ku(23 - 20, -1 + 5 - 20), Ku(13 - 20, -4 + 5 - 20));
        ia(Ku(23 - 20, -15), Ku(25 - 20, -40 + 5 - 30), Ku(26.5 - 20, -43 + 5 - 30), Ku(28 - 20, -40 + 5 - 30), Ku(30 - 20, 0 + 5 - 20));
        NM.fillStyle = '#888888';
        NM.fillRect(24 + KO.x - 20, 0 + KO.y + 7 - 20, 5, 15);
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function Gb(Kx, Ky) {
        const KK = 24
          , KO = Ky;
        NM.save();
        NM.rotate(Kx * Math.PI / 180);
        NM.lineJoin = 'round';
        NM.fillStyle = '#84878b';
        NM.strokeStyle = '#6d7074';
        NM.lineWidth = 2;
        NM.beginPath();
        NM.roundRect(-KK / 2, -KO / 2, KK, KO, 5);
        NM.fill();
        NM.stroke();
        NM.fillStyle = '#b2f8ff';
        NM.beginPath();
        NM.roundRect(-KK / 2 + 4, -KO / 2 + 4, KK - 8, KO - 8, 3);
        NM.fill();
        NM.strokeStyle = 'rgba(120, 130, 140, 0.55)';
        NM.lineWidth = 1.5;
        NM.beginPath();
        NM.moveTo(-KK / 2 + 6, -KO / 2 + 15);
        NM.lineTo(KK / 2 - 6, -KO / 2 + 6);
        NM.moveTo(-KK / 2 + 6, -KO / 2 + 21);
        NM.lineTo(KK / 2 - 6, -KO / 2 + 12);
        NM.stroke();
        NM.restore();
    }
    function GF(Kx, Ky, KK, KO) {
        NM.save();
        NM.translate(Ky, KK);
        if (KO.u !== 4) {
            const Ku = [{
                'angle': -70,
                'distance': 60,
                'length': 40
            }, {
                'angle': 0,
                'distance': 50,
                'length': 25
            }, {
                'angle': 70,
                'distance': 60,
                'length': 40
            }];
            NM.scale(Kx.facing, 1);
            if (KO.u == 1) {
                as(Kx, 35, -5);
            } else {
                as(Kx, 30, -35);
            }
            const KW = Ku.map(Kl => {
                const Ks = Kl.angle * Math.PI / 180;
                const KZ = Math.cos(Ks) * Kl.distance
                  , Kp = Math.sin(Ks) * Kl.distance;
                const Kh = Math.sin(Ks) * Kl.length / 2
                  , Kg = -Math.cos(Ks) * Kl.length / 2;
                return {
                    'cx': KZ,
                    'cy': Kp,
                    'ends': [{
                        'x': KZ + Kh,
                        'y': Kp + Kg
                    }, {
                        'x': KZ - Kh,
                        'y': Kp - Kg
                    }]
                };
            }
            );
            const KB = (Kl, Ks) => Kl.ends[Math.hypot(Kl.ends[0].x - Ks.cx, Kl.ends[0].y - Ks.cy) <= Math.hypot(Kl.ends[1].x - Ks.cx, Kl.ends[1].y - Ks.cy) ? 0 : 1];
            NM.strokeStyle = '#6d7074';
            NM.lineWidth = 1.5;
            for (let Kl = 0; Kl < KW.length - 1; Kl++) {
                if (KO.u === Kl + 1 || KO.u === Kl + 2)
                    continue;
                const Ks = KB(KW[Kl], KW[Kl + 1])
                  , KZ = KB(KW[Kl + 1], KW[Kl]);
                const Kp = KZ.x - Ks.x
                  , Kh = KZ.y - Ks.y;
                const Kg = Math.max(2, Math.round(Math.hypot(Kp, Kh) / 5));
                for (let Kr = 0; Kr < Kg; Kr++) {
                    NM.save();
                    NM.translate(Ks.x + Kp * (Kr + 0.5) / Kg, Ks.y + Kh * (Kr + 0.5) / Kg);
                    NM.rotate(Math.atan2(Kh, Kp));
                    NM.beginPath();
                    NM.ellipse(0, 0, Math.hypot(Kp, Kh) / Kg * 0.8, Kr % 2 ? 1 : 2.5, 0, 0, Math.PI * 2);
                    NM.stroke();
                    NM.restore();
                }
            }
            for (let KD = 0; KD < Ku.length; KD++) {
                if (KO.u === KD + 1)
                    continue;
                NM.save();
                NM.translate(KW[KD].cx, KW[KD].cy);
                Gb(Ku[KD].angle, Ku[KD].length);
                NM.restore();
            }
        } else {
            aZ(Kx);
            NM.scale(KO.facing, 1);
        }
        NM.restore();
        Gv(Kx, Ky + 39 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 795, 661, 46, 197, -23, -130, 40, 150);
        as(Kx, KO.x, 10);
        NM.resetTransform();
    }
    function GU(Kx, Ky, KK, KO) {
        Gv(Kx, Ky + -10 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        as(Kx, -10 + KO.x, -16);
        as(Kx, -5 + KO.x, -30);
        NM.drawImage(Nc['./images/weapons.png'], 575, 680, 30, 82, KO.x + 30, -50, 30, 100);
        NM.drawImage(Nc['./images/weapons.png'], 525, 678, 50, 137, 40, -170, 40, 200);
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function GC(Kx, Ky, KK, KO) {
        Gv(Kx, Ky + -10 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        as(Kx, -10 + KO.x, -16);
        as(Kx, -5 + KO.x, -30);
        NM.drawImage(Nc['./images/weapons.png'], 669, 680, 26, 81, KO.x + 30, -50, 30, 100);
        NM.drawImage(Nc['./images/weapons.png'], 612, 668, 50, 147, 40, -170, 40, 200);
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function Gz(Kx, Ky, KK, KO) {
        if (!KO.u) {
            as(Kx, 40 * Kx.facing, -30);
            NM.strokeStyle = '#BBAA00';
            NM.fillStyle = '#acf7ff';
            NM.lineWidth = 5;
            NM.beginPath();
            NM.ellipse(60 * Kx.facing + Ky, KK, 20, 58 / 1.5, -0.3 * Kx.facing, 0, Math.PI * 2);
            NM.closePath();
            NM.fill();
            NM.stroke();
        } else {
            aZ(Kx);
        }
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky + 35 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        NM.strokeStyle = ir(KO.color, 40);
        NM.lineWidth = 5;
        ia(Ku(23 - 20, -15), Ku(25 - 20, -40 + 5 - 50), Ku(26.5 - 20, -43 + 5 - 50), Ku(28 - 20, -40 + 5 - 50), Ku(30 - 20, 0 + 5 - 20));
        ia(Ku(23 - 20, 5 - 20), Ku(30 - 20, 5 - 20), Ku(40 - 20, -4 + 5 - 20), Ku(30 - 20, -1 + 5 - 20), Ku(23 - 20, -1 + 5 - 20), Ku(13 - 20, -4 + 5 - 20));
        NM.fillStyle = '#888888';
        NM.fillRect(24 + KO.x - 20, 0 + KO.y + 7 - 20, 5, 15);
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function Gf(Kx, Ky, KK, KO) {
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky + -25 * KO.facing, KK + 25, KO);
        ia(Ku(-35, -110), Ku(35, -110), Ku(35, -150), Ku(-35, -150));
        NM.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ia(Ku(-35, -110), Ku(35, -110), Ku(35, -150), Ku(-35, -150));
        NM.fillStyle = 'gray';
        NM.beginPath();
        NM.arc(0, 0, 6, 0, Math.PI * 2);
        NM.fill();
        NM.fillRect(-3, 0, 6, -108);
        as(Kx, 0, -10);
        as(Kx, 0, -40);
        NM.scale(KO.facing, 1);
        NM.resetTransform();
    }
    function GR(Kx, Ky, KK, KO) {
        Gv(Kx, Ky + -25 * KO.facing, KK + 25, KO);
        NM.drawImage(Nc['./images/weapons.png'], 2, 133, 84, 155, -42, -153, 84, 155);
        as(Kx, 0, -10);
        as(Kx, 0, -40);
        NM.scale(KO.facing, 1);
        NM.resetTransform();
    }
    function Gm(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + -30 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 91, 147, 41, 124, -(41 - 12), -(147 - 32), 41, 124);
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function Gn(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + -30 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 126, 292, 38, 124, -(41 - 12), -(147 - 32), 38, 124);
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function i0(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + -30 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 204, 85, 61, 200, -(61 - 30), -170, 61, 200);
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function i1(Kx, Ky, KK, KO) {
        Gv(Kx, Ky + -30 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 275, 36, 62, 248, -(61 - 20), -185, 61, 200);
        as(Kx, 0, 0);
        as(Kx, -5, 5);
        NM.resetTransform();
    }
    function i2(Kx, Ky, KK, KO) {
        Gv(Kx, Ky + -30 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        NM.drawImage(Nc['./images/weapons.png'], 0, 539, 145, 331, -60, -275, 150, 300);
        as(Kx, 15, -15);
        as(Kx, 10, -10);
        NM.resetTransform();
    }
    function i3(Kx, Ky, KK, KO) {
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky, KK + 25, KO);
        NM.scale(KO.facing, 1);
        if (KO.attackProgress < 20) {
            NM.rotate(-KO.attackProgress * Math.PI / 20);
            NM.drawImage(Nc['./images/weapons.png'], 265, 532, 90, 228, -15, -223, 90, 228);
            NM.rotate(KO.attackProgress * Math.PI / 20);
            NM.drawImage(Nc['./images/weapons.png'], 265, 532, 90, 228, -15, -223, 90, 228);
        } else if (KO.attackProgress < 120) {
            ia(Ku(-1, -50), Ku(2.5, -50), Ku(2.5, 50), Ku(-1, 50));
            NM.fillStyle = 'gray';
            NM.fillRect(0, 0, 0, 0);
            NM.rotate(-Math.PI);
            NM.drawImage(Nc['./images/weapons.png'], 265, 532, 90, 228, -15, -223 - (Math.min(KO.attackProgress, 40) - Math.max(0, KO.attackProgress - 100) - 20) * 1.5, 90, 228);
            NM.rotate(Math.PI);
            NM.drawImage(Nc['./images/weapons.png'], 265, 532, 90, 228, -15, -223 - (Math.min(KO.attackProgress, 40) - Math.max(0, KO.attackProgress - 100) - 20) * 1.5, 90, 228);
        } else if (KO.attackProgress < 140) {
            NM.rotate(-(220 - KO.attackProgress) * Math.PI / 20);
            NM.drawImage(Nc['./images/weapons.png'], 265, 532, 90, 228, -15, -223, 90, 228);
            NM.rotate((220 - KO.attackProgress) * Math.PI / 20);
            NM.drawImage(Nc['./images/weapons.png'], 265, 532, 90, 228, -15, -223, 90, 228);
        } else {
            NM.drawImage(Nc['./images/weapons.png'], 265, 532, 90, 228, -15, -223, 90, 228);
        }
        NM.scale(KO.facing, 1);
        as(Kx, 0, 0);
        as(Kx, -5, 5);
        NM.resetTransform();
    }
    function i4(Kx, Ky, KK, KO) {
        aZ(Kx);
        Gv(Kx, Ky + -30 * KO.facing, KK + 20, KO);
        NM.scale(KO.facing, 1);
        if (!Kx.weapon.e) {
            NM.drawImage(Nc['./images/weapons.png'], 169, 90, 32, 204, -(25 - 13), -170, 32, 204);
        } else {
            NM.drawImage(Nc['./images/weapons.png'], 136, 90, 32, 204, -(25 - 13), -170, 32, 204);
        }
        as(Kx, 0, 0);
        NM.resetTransform();
    }
    function i5(Kx, Ky, KK, KO) {
        Gv(Kx, Ky, KK, KO);
        for (let Ku = 0; Ku < 4; Ku++) {
            NM.drawImage(Nc['./images/weapons.png'], 0, 362, 26, 56, -13 + KO.x, -28, 26, 56);
            NM.rotate(Math.PI / 2);
        }
        NM.resetTransform();
    }
    function i6(Kx, Ky, KK, KO) {
        let Ku = (KB, Kl) => {
            return {
                'x': KB + KO.x,
                'y': Kl + KO.y
            };
        }
        ;
        Gv(Kx, Ky + -25 * KO.facing, KK + 25, KO);
        let KW = ir(KO.color, 50);
        NM.strokeStyle = KW;
        NM.lineWidth = 5;
        NM.fillStyle = KO.color;
        ia(Ku(-40, -140), Ku(40, -140), Ku(40, -200), Ku(-40, -200));
        ia(Ku(-40, -135), Ku(-30, -135), Ku(-30, -205), Ku(-40, -205));
        ia(Ku(40, -135), Ku(30, -135), Ku(30, -205), Ku(40, -205));
        NM.fillStyle = '#333';
        NM.beginPath();
        NM.arc(0, 0, 6, 0, Math.PI * 2);
        NM.fill();
        NM.fillRect(-3, 0, 6, -138);
        as(Kx, 0, -10);
        as(Kx, 0, -40);
        NM.scale(KO.facing, 1);
        NM.resetTransform();
    }
    function i7(Kx, Ky, KK, KO) {
        let Ku = (KB, Kl) => {
            return {
                'x': KB + KO.x,
                'y': Kl + KO.y
            };
        }
        ;
        Gv(Kx, Ky + -25 * KO.facing, KK + 25, KO);
        let KW = ir(KO.color, 50);
        NM.fillStyle = KW;
        NM.strokeStyle = KW;
        ia(Ku(-30, -200), Ku(0, -180), Ku(30, -200), Ku(10, -170), Ku(30, -140), Ku(0, -160), Ku(-30, -140), Ku(-10, -170));
        NM.fillStyle = KO.color;
        NM.beginPath();
        NM.arc(0, -170, 30, 0, Math.PI * 2);
        NM.fill();
        NM.stroke();
        NM.fillStyle = '#333';
        NM.beginPath();
        NM.arc(0, 0, 6, 0, Math.PI * 2);
        NM.fill();
        NM.fillRect(-3, 0, 6, -138);
        as(Kx, 0, -10);
        as(Kx, 0, -40);
        NM.scale(KO.facing, 1);
        NM.resetTransform();
    }
    function i8(Kx, Ky, KK, KO) {
        aZ(Kx);
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky, KK, KO);
        NM.scale(KO.facing, 1);
        ia(Ku(70 / 2, 15 / 2), Ku(270 / 2, 15 / 2), Ku(286 / 2, 20 / 2), Ku(270 / 2, 25 / 2), Ku(70 / 2, 25 / 2));
        NM.fillStyle = 'gray';
        NM.fillRect(20 + KO.x, 16 / 2, 15, 4);
        as(Kx, 30 + KO.x, 12);
        NM.resetTransform();
    }
    function i9(Kx, Ky, KK, KO) {
        let Ku = (KW, KB) => {
            return {
                'x': KW + KO.x,
                'y': KB + KO.y
            };
        }
        ;
        Gv(Kx, Ky, KK, KO);
        NM.scale(KO.facing, 1);
        ia(Ku(70 / 2, 0 + 5), Ku(450 / 2, 12 / 2 + 5), Ku(476 / 2, 20 / 2 + 5), Ku(450 / 2, 28 / 2 + 5), Ku(70 / 2, 40 / 2 + 5));
        NM.fillStyle = 'gray';
        NM.strokeStyle = 'gray';
        ia(Ku(450 / 2, 12 / 2 + 5), Ku(476 / 2, 20 / 2 + 5), Ku(450 / 2, 28 / 2 + 5));
        NM.fillRect(-10 + KO.x, 6 + 5, 44, 8);
        NM.beginPath();
        NM.arc(-10 + KO.x, 10 + 5, 6, 0, Math.PI * 2);
        NM.fill();
        as(Kx, 5 + KO.x, 16);
        as(Kx, 15 + KO.x, 16);
        NM.resetTransform();
    }
    function iI(Kx, Ky, KK, KO) {
        Gv(Kx, Ky + -10 * KO.facing, KK, KO);
        NM.scale(KO.facing, 1);
        as(Kx, 5 + KO.x, 16);
        as(Kx, 15 + KO.x, 16);
        NM.drawImage(Nc['./images/weapons.png'], 265, 463, 298, 50, KO.x, -10, 300, 50);
        NM.resetTransform();
    }
    function ia(...Kx) {
        NM.beginPath();
        NM.moveTo(Kx[0].x * 1, Kx[0].y);
        for (let Ky = 0; Ky < arguments.length; Ky++)
            NM.lineTo(Kx[Ky].x * 1, Kx[Ky].y);
        NM.closePath();
        NM.stroke();
        NM.fill();
    }
    function iG(...Kx) {
        Nt.beginPath();
        Nt.moveTo(Kx[0].x * 1, Kx[0].y);
        for (let Ky = 0; Ky < arguments.length; Ky++)
            Nt.lineTo(Kx[Ky].x * 1, Kx[Ky].y);
        Nt.closePath();
        Nt.stroke();
        Nt.fill();
    }
    function ii(Kx) {
        NM.beginPath();
        NM.moveTo(Kx[0].x * 1, Kx[0].y);
        for (let Ky = 0; Ky < Kx.length; Ky++)
            NM.lineTo(Kx[Ky].x * 1, Kx[Ky].y);
        NM.closePath();
        NM.stroke();
        NM.fill();
    }
    function iN(...Kx) {
        NM.beginPath();
        NM.moveTo(Kx[0].x, Kx[0].y);
        for (let Ky = 0; Ky < arguments.length; Ky++)
            NM.lineTo(Kx[Ky].x, Kx[Ky].y);
        NM.closePath();
        NM.fill();
    }
    function ix(Kx, Ky, KK) {
        if (Kx.hp === 100)
            return 0;
        NM.fillStyle = 'black';
        NM.fillRect(Kx.x + Ky - 25, Kx.y - Kx.sz / 2 - 12 + KK, 50, 6);
        NM.strokeStyle = 'black';
        NM.lineWidth = 2;
        NM.strokeRect(Kx.x + Ky - 25, Kx.y - Kx.sz / 2 - 12 + KK, 50, 6);
        NM.fillStyle = '#00FF00';
        NM.fillRect(Kx.x + Ky - 25, Kx.y - Kx.sz / 2 - 12 + KK, 50 * (Kx.hp / 100), 6);
    }
    function iy(Kx, Ky, KK, KO, Ku, KW) {
        let KB = Ny(Math.round(Kx), Math.round(Ky + 10 * Math.sin(Date.now() / 200)), KO, Ku);
        NM.translate(KB.x, KB.y);
        NM.scale(Ku, Ku);
        NM.fillStyle = 'rgba(0, 0, 0, 0.2)';
        NM.beginPath();
        NM.ellipse(0, 18, 25, 10, 0, 0, Math.PI * 2);
        NM.fill();
        let Kl = Nc['./images/itemmap.png'];
        NM.drawImage(Kl, 50 * (KK.id % 20), 50 * Math.floor(KK.id / 20), 50, 50, -25, -25, 50, 50);
        if (KW) {
            NM.fillStyle = 'white';
            NM.font = 'bold 20px Quicksand';
            NM.strokeStyle = 'black';
            NM.lineWidth = 2;
            let Ks = Nq.itemData[KK.id].name;
            let KZ = NM.measureText(Ks).width;
            NM.strokeText(Ks, -KZ / 2, 50);
            NM.fillText(Ks, -KZ / 2, 50);
        }
        NM.resetTransform();
    }
    function iK(Kx, Ky, KK) {
        Ky = Ky ?? {
            'x': 0,
            'y': 0
        };
        let KO = 0 - Ky.x + NQ.width / 2;
        let Ku = 0 - Ky.y + NQ.height / 2;
        let KW = Ny(Kx.x, Kx.y, Ky, KK);
        NM.translate(KW.x, KW.y);
        NM.scale(KK, KK);
        id(Kx.x, Kx.y, Kx.r);
        NM.rotate((Kx.a + 90) * Math.PI / 180);
        let KB = (Ks, KZ) => {
            return {
                'x': Ks,
                'y': KZ
            };
        }
        ;
        let Kl = Ks => {
            NM.beginPath();
            NM.lineWidth = Kx.r / 4;
            NM.fillStyle = Ks;
            NM.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            NM.arc(0, 0, Kx.r, 0, 2 * Math.PI);
            NM.fill();
            NM.beginPath();
            NM.arc(0, 0, Kx.r - Kx.r / 8, 0, 2 * Math.PI);
            NM.stroke();
        }
        ;
        switch (Kx.t) {
        case 'proj_fire':
            iB({
                'x': Kx.x,
                'y': Kx.y,
                'sz': Kx.r + 8
            }, KO, Ku, Ky);
            NM.resetTransform();
            ip(Kx.x, Kx.y, Ky, Kx.r * 2 + 10, KK);
            return;
        case 'proj_tr':
            NM.globalAlpha = 0.4;
            NM.beginPath();
            NM.fillStyle = Kx.c;
            NM.arc(0, 0, Kx.r, 0, 2 * Math.PI);
            NM.fill();
            NM.globalAlpha = 1;
            break;
        case 'proj_tr2':
            NM.globalAlpha = 0.4;
            NM.beginPath();
            NM.fillStyle = Kx.c;
            NM.arc(0, 0, Kx.r, 0, 2 * Math.PI);
            NM.fill();
            NM.globalAlpha = 1;
            iw(Kx.x, Kx.y, Kx.r, [0, 0, 0, 0.4], Ky, {
                'e': 2,
                'noColor': !![]
            });
            break;
        case 'proj_gl':
            NM.beginPath();
            NM.fillStyle = Kx.c;
            NM.arc(-5, 5, 10, 0, 2 * Math.PI);
            NM.fill();
            NM.drawImage(Nc['./images/weapons.png'], 418, 12, 40, 40, -20, -20, 40, 40);
            break;
        case 'proj_rain':
            NM.fillStyle = '#3f7bfc';
            NM.beginPath();
            NM.arc(0, 0, Kx.r, 0, 2 * Math.PI);
            NM.fill();
            NM.beginPath();
            NM.moveTo(-Kx.r, 0);
            NM.lineTo(0, Kx.r * 2);
            NM.lineTo(Kx.r, 0);
            NM.closePath();
            NM.fill();
            NM.fillStyle = '#7ea8fc';
            NM.beginPath();
            NM.arc(3, 3, 5, 0, 2 * Math.PI);
            NM.fill();
            break;
        case 'proj_ro':
            NM.lineWidth = 2;
            NM.fillStyle = '#777';
            NM.fillRect(-10, -10, 20, 30);
            NM.fillStyle = '#991111';
            NM.strokeStyle = '#770505';
            NM.beginPath();
            NM.moveTo(-10, -10);
            NM.lineTo(0, -20);
            NM.lineTo(10, -10);
            NM.stroke();
            NM.fill();
            break;
        case 'proj_whirl':
            NM.rotate(Nq.GAME_TICK * Math.PI / 180 * 6);
            let Ks = Kx.r;
            if (Kx.r > 70)
                Ks = 70;
            NM.drawImage(Nc['./images/weapons.png'], 62, 25, 40, 40, -Ks, -Ks, Ks * 2, Ks * 2);
            break;
        case 'proj_cake':
            NM.drawImage(Nc['./images/weapons.png'], 0, 295, 80, 65, -Kx.r, -Kx.r, Kx.r * 2, Kx.r * 2);
            break;
        case 'proj_lazer':
            NM.rotate(-Math.PI / 2);
            NM.drawImage(Nc['./images/weapons.png'], 321, 416, 177, 10, 177 * -Kx.r / 20, 10 * -Kx.r / 20, 177 * Kx.r * 2 / 20, 10 * Kx.r * 2 / 20);
            break;
        case 'proj_sa':
            NM.fillStyle = 'yellow';
            NM.strokeStyle = '#ffff9e';
            NM.lineWidth = 2;
            NM.beginPath();
            NM.moveTo(Kx.r / 2, 0);
            for (let KA = 1; KA < 11; KA++) {
                let Kk = 36 * KA;
                let Ko = Kx.r / 2 * (KA % 2 + 1);
                NM.lineTo(Ko * Math.cos(Kk * Math.PI / 180), Ko * Math.sin(Kk * Math.PI / 180));
            }
            NM.stroke();
            NM.fill();
            break;
        case 'proj_arrow':
            NM.scale(1.3, 1.3);
            NM.fillStyle = '#aba189';
            NM.strokeStyle = '#3f3b31';
            NM.lineWidth = 2;
            NM.fillRect(-2, -5, 4, 20);
            ia(KB(-2, 15), KB(-4, 17), KB(-4, 14), KB(-2, 13));
            ia(KB(2, 15), KB(4, 17), KB(4, 14), KB(2, 13));
            NM.fillStyle = '#666666';
            ia(KB(-2, -5), KB(0, -9), KB(2, -5));
            break;
        case 'proj_spit':
            let KZ = Kx.c;
            if (Kx.c == 'fire') {
                KZ = 'rgb(255, ' + Math.round(Math.sin(Date.now() / 100) * 255) + ', 0)';
            }
            Kl(KZ);
            break;
        case 'proj_acid':
            if (Kx.g === 0) {
                NM.strokeStyle = Kx.c;
                NM.lineWidth = Kx.r;
                NM.lineCap = 'round';
                NM.beginPath();
                NM.moveTo(0, -Kx.r * 1.2);
                NM.lineTo(0, Kx.r * 1.2);
                NM.stroke();
                break;
            }
            Kl(Kx.c);
            break;
        case 'proj_spit4':
            NM.globalAlpha = 0.6;
            Kl(Kx.c);
            NM.globalAlpha = 1;
            break;
        case 'proj_spit3':
            let Kp = Kx.c;
            if (Kx.c == 'fire') {
                Kp = 'rgb(255, ' + Math.round(Math.sin(Date.now() / 100) * 255) + ', 0)';
            }
            Kl(Kp);
            iw(Kx.x, Kx.y, Kx.r, [0, 0, 0, 1], Ky, {
                'e': 2,
                'noColor': !![]
            });
            break;
        case 'proj_spit2':
            iB({
                'x': Kx.x,
                'y': Kx.y,
                'sz': Kx.r + 4
            }, KO, Ku, Ky);
            Kl(Kx.c);
            break;
        case 'proj_ra':
            Kl('rgb(' + (Math.sin(Nq.GAME_TICK / 30) * 127 + 127) + ',' + (Math.cos(Nq.GAME_TICK / 30 + 15) * 127 + 127) + ',' + (Math.cos(Nq.GAME_TICK / 30) * 127 + 127) + ')');
            break;
        case 'proj_bul1':
            NM.fillStyle = '#6b6b6b';
            NM.fillRect(-6, -6, 12, 40);
            NM.beginPath();
            NM.arc(0, -10, 6, 0, 2 * Math.PI);
            NM.fill();
            NM.fillStyle = Kx.c;
            NM.fillRect(-6, 0, 12, 5);
            break;
        case 'proj_bul2':
            NM.fillStyle = '#6b6b6b';
            NM.fillRect(-5, -5, 10, 20);
            NM.beginPath();
            NM.arc(0, -7.5, 5, 0, 2 * Math.PI);
            NM.fill();
            NM.fillStyle = Kx.c;
            NM.fillRect(-5, 0, 10, 5);
            break;
        case 'proj_da':
            NM.fillStyle = 'rgba(255, 255, 255, 0.5)';
            NM.beginPath();
            NM.arc(0, 0, Kx.r, 0, Math.PI * 2);
            NM.fill();
            NM.fillStyle = '#d1bfa9';
            NM.beginPath();
            NM.arc(0, 0, Kx.r / 5, 0, Math.PI * 2);
            NM.fill();
            break;
        case 'Dynamite':
            NM.drawImage(Nc['./images/weapons.png'], 450, 620, 95, 54, -Kx.r, -Kx.r, 60, 28);
            break;
        case 'Smoke':
            NM.drawImage(Nc['./images/weapons.png'], 506, 132, 61, 34, -30, 10, 60, 28);
            break;
        case 'meteor':
            NM.drawImage(Nc['./images/weapons.png'], 855, 337, 40, 45, -Kx.r, -Kx.r, 80, 80);
            break;
        case 'Nuke':
            NM.drawImage(Nc['./images/weapons.png'], 837, 560, 86, 99, -Kx.r, -Kx.r, 86, 99);
            break;
        case 'shuriken':
            NM.rotate(Date.now() * 0.03 % (Math.PI * 2));
            NM.drawImage(Nc['./images/weapons.png'], 585, 48, 40, 40, -Kx.r - 10, -Kx.r - 10, 35, 35);
            break;
        case 'glaive':
            NM.rotate(Date.now() * 0.03 % (Math.PI * 2));
            NM.drawImage(Nc['./images/weapons.png'], 704, 41, 53, 54, -Kx.r - 25, -Kx.r - 25, 53, 54);
            break;
        case 'boomerang':
            NM.drawImage(Nc['./images/weapons.png'], 524, 45, 43, 65, -Kx.r, -Kx.r, 20, 40);
            break;
        case 'ThrowingKinfe':
            NM.drawImage(Nc['./images/weapons.png'], 623, 46, 19, 64, -Kx.r - 4, -Kx.r - 4, 20, 60);
            break;
        case 'Assassin':
            NM.drawImage(Nc['./images/weapons.png'], 595, 101, 16, 66, -Kx.r - 4, -Kx.r - 4, 25, 80);
            break;
        case 'Executor':
            NM.rotate(-90 * Math.PI / 180);
            NM.drawImage(Nc['./images/weapons.png'], 507, 0, 68, 20, -80, -15, 80, 30);
            break;
        case 'proj_lightning1':
            NM.strokeStyle = '#00ffff';
            NM.fillStyle = '#ffffff';
            NM.lineWidth = 3;
            NM.beginPath();
            NM.moveTo(-Kx.r, 0);
            let Kh = 8;
            let Kg = Kx.r * 2 / Kh;
            for (let KT = 1; KT <= Kh; KT++) {
                let KJ = -Kx.r + KT * Kg;
                let Kd = Math.sin(Nq.GAME_TICK / 10 + KT * 2) * 8 + (Math.random() * 6 - 3);
                NM.lineTo(KJ, Kd);
            }
            NM.stroke();
            NM.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            NM.lineWidth = 8;
            NM.stroke();
            NM.fillStyle = '#ffff00';
            for (let Kw = 0; Kw < 5; Kw++) {
                let KP = Math.random() * Math.PI * 2;
                let KH = Math.random() * Kx.r;
                let Kt = Math.cos(KP) * KH;
                let KV = Math.sin(KP) * KH;
                NM.beginPath();
                NM.arc(Kt, KV, 2, 0, Math.PI * 2);
                NM.fill();
            }
            break;
        case 'proj_lightning2':
            NM.strokeStyle = '#ffff00';
            NM.fillStyle = '#ffffff';
            NM.lineWidth = 3;
            NM.beginPath();
            NM.moveTo(-Kx.r, 0);
            for (let Kj = 1; Kj <= 8; Kj++) {
                let Kc = -Kx.r + Kj * (Kx.r * 2) / 8;
                let Kq = Math.sin(Nq.GAME_TICK / 10 + Kj * 2) * 8 + (Math.random() * 6 - 3);
                NM.lineTo(Kc, Kq);
            }
            NM.stroke();
            NM.strokeStyle = 'rgba(255, 255, 0, 0.3)';
            NM.lineWidth = 8;
            NM.stroke();
            NM.fillStyle = '#00ffff';
            for (let Kb = 0; Kb < 5; Kb++) {
                let KF = Math.random() * Math.PI * 2;
                let KU = Math.random() * Kx.r;
                let KC = Math.cos(KF) * KU;
                let Kz = Math.sin(KF) * KU;
                NM.beginPath();
                NM.arc(KC, Kz, 2, 0, Math.PI * 2);
                NM.fill();
            }
            break;
        case 'proj_lightning3':
            let Kr = Kx.r * 1.5;
            if (Math.random() > 0.5) {
                NM.strokeStyle = '#00ffff';
                NM.lineWidth = 3;
                NM.beginPath();
                NM.moveTo(0, -Kr);
                for (let Kf = 1; Kf <= 12; Kf++) {
                    let KR = -Kr + Kf * (Kr * 2) / 12;
                    let Km = Math.sin(Nq.GAME_TICK / 8 + Kf * 3) * 4 + (Math.random() * 3 - 1.5);
                    NM.lineTo(Km, KR);
                }
                NM.stroke();
                NM.strokeStyle = 'rgba(0, 255, 255, 0.3)';
                NM.lineWidth = 8;
                NM.stroke();
                NM.strokeStyle = '#ffff00';
                NM.lineWidth = 3;
                NM.beginPath();
                NM.moveTo(0, -Kr);
                for (let Kn = 1; Kn <= 12; Kn++) {
                    let O0 = -Kr + Kn * (Kr * 2) / 12;
                    let O1 = Math.sin(Nq.GAME_TICK / 8 + Kn * 3 + Math.PI) * 4 + (Math.random() * 3 - 1.5);
                    NM.lineTo(O1, O0);
                }
                NM.stroke();
                NM.strokeStyle = 'rgba(255, 255, 0, 0.3)';
                NM.lineWidth = 8;
                NM.stroke();
            } else {
                NM.strokeStyle = '#ffff00';
                NM.lineWidth = 3;
                NM.beginPath();
                NM.moveTo(0, -Kr);
                for (let O2 = 1; O2 <= 12; O2++) {
                    let O3 = -Kr + O2 * (Kr * 2) / 12;
                    let O4 = Math.sin(Nq.GAME_TICK / 8 + O2 * 3 + Math.PI) * 4 + (Math.random() * 3 - 1.5);
                    NM.lineTo(O4, O3);
                }
                NM.stroke();
                NM.strokeStyle = 'rgba(255, 255, 0, 0.3)';
                NM.lineWidth = 8;
                NM.stroke();
                NM.strokeStyle = '#00ffff';
                NM.lineWidth = 3;
                NM.beginPath();
                NM.moveTo(0, -Kr);
                for (let O5 = 1; O5 <= 12; O5++) {
                    let O6 = -Kr + O5 * (Kr * 2) / 12;
                    let O7 = Math.sin(Nq.GAME_TICK / 8 + O5 * 3) * 4 + (Math.random() * 3 - 1.5);
                    NM.lineTo(O7, O6);
                }
                NM.stroke();
                NM.strokeStyle = 'rgba(0, 255, 255, 0.3)';
                NM.lineWidth = 8;
                NM.stroke();
            }
            NM.fillStyle = '#ffffff';
            for (let O8 = 0; O8 < 4; O8++) {
                let O9 = -Kr + O8 * Kr / 2;
                let OI = Math.sin(Nq.GAME_TICK / 5 + O8) * 2;
                NM.beginPath();
                NM.arc(OI, O9, 2, 0, Math.PI * 2);
                NM.fill();
            }
            break;
        case 'proj_lightning4':
            let KD = Kx.r * 1.67;
            NM.strokeStyle = '#00ffff';
            NM.lineWidth = 4;
            NM.beginPath();
            NM.moveTo(0, -KD);
            for (let Oa = 1; Oa <= 16; Oa++) {
                let OG = -KD + Oa * (KD * 2) / 16;
                let Oi = Math.sin(Nq.GAME_TICK / 6 + Oa * 2.5) * 6 + (Math.random() * 4 - 2);
                NM.lineTo(Oi, OG);
            }
            NM.stroke();
            NM.strokeStyle = 'rgba(0, 255, 255, 0.4)';
            NM.lineWidth = 12;
            NM.stroke();
            NM.strokeStyle = '#ffffff';
            NM.lineWidth = 2;
            NM.stroke();
            NM.fillStyle = '#ffff00';
            for (let ON = 0; ON < 6; ON++) {
                let Ox = -KD + ON * KD / 3;
                let Oy = Math.sin(Nq.GAME_TICK / 4 + ON) * 3;
                NM.beginPath();
                NM.arc(Oy, Ox, 3, 0, Math.PI * 2);
                NM.fill();
            }
            break;
        case 'proj_lightning5':
            let KQ = Kx.r * 1.47;
            NM.strokeStyle = '#ffff00';
            NM.lineWidth = 3;
            NM.beginPath();
            NM.moveTo(0, -KQ);
            for (let OK = 1; OK <= 14; OK++) {
                let OO = -KQ + OK * (KQ * 2) / 14;
                let Ou = Math.sin(Nq.GAME_TICK / 5 + OK * 2) * 5 + (Math.random() * 3 - 1.5);
                NM.lineTo(Ou, OO);
            }
            NM.stroke();
            NM.strokeStyle = 'rgba(255, 255, 0, 0.4)';
            NM.lineWidth = 10;
            NM.stroke();
            NM.fillStyle = '#00ffff';
            for (let OW = 0; OW < 4; OW++) {
                let OB = -KQ + OW * KQ / 3;
                let Ol = Math.sin(Nq.GAME_TICK / 4 + OW) * 3;
                NM.beginPath();
                NM.arc(Ol, OB, 2, 0, Math.PI * 2);
                NM.fill();
            }
            break;
        case 'proj_lightning6':
            let KM = Kx.r * 1.87;
            NM.strokeStyle = '#00ffff';
            NM.lineWidth = 3.5;
            NM.beginPath();
            NM.moveTo(0, -KM);
            for (let Os = 1; Os <= 18; Os++) {
                let OZ = -KM + Os * (KM * 2) / 18;
                let Op = Math.sin(Nq.GAME_TICK / 7 + Os * 3) * 7 + (Math.random() * 4 - 2);
                NM.lineTo(Op, OZ);
            }
            NM.stroke();
            NM.strokeStyle = 'rgba(0, 255, 255, 0.4)';
            NM.lineWidth = 11;
            NM.stroke();
            NM.strokeStyle = '#ffffff';
            NM.lineWidth = 2;
            NM.stroke();
            NM.fillStyle = '#ffff00';
            for (let Oh = 0; Oh < 7; Oh++) {
                let Og = -KM + Oh * KM / 3.5;
                let Or = Math.sin(Nq.GAME_TICK / 4 + Oh * 1.5) * 4;
                NM.beginPath();
                NM.arc(Or, Og, 2, 0, Math.PI * 2);
                NM.fill();
            }
            NM.fillStyle = '#00ff00';
            for (let OD = 0; OD < 4; OD++) {
                let OQ = -KM + OD * KM / 2.5;
                let OM = Math.sin(Nq.GAME_TICK / 6 + OD * 2) * 3;
                NM.beginPath();
                NM.arc(OM, OQ, 1.5, 0, Math.PI * 2);
                NM.fill();
            }
            break;
        case 'proj_shockwave':
            NM.save();
            NM.fillStyle = Kx.c;
            NM.strokeStyle = Kx.c;
            let KY = 70 / 2 * Math.PI / 180;
            let KX = -Math.PI / 2;
            let KE = KX - KY / 2;
            let Kv = KX + KY / 2;
            let Ke = 2 * Kx.r;
            let KL = -Math.cos(KX) * Ke;
            let KS = -Math.sin(KX) * Ke;
            NM.translate(KL, KS);
            NM.beginPath();
            NM.arc(0, 0, Ke, KE, Kv);
            NM.lineWidth = 12;
            NM.stroke();
            NM.restore();
            break;
        case 'proj_blue_fire':
            iw(Kx.x, Kx.y, Kx.r + 8, [0, 150, 255, 0.4], Ky, {
                'e': 1
            });
            NM.resetTransform();
            iZ(Kx.x, Kx.y, Ky, Kx.r * 2 + 10, KK);
            return;
        case 'beam':
            NM.drawImage(Nc['./images/weapons.png'], 882, 978, 47, 40, -Kx.r, -Kx.r, 47, 40);
            break;
        }
        NM.resetTransform();
    }
    const iO = {
        'm_h1': {
            'sX': 0,
            'sY': 0,
            'sW': 50,
            'sH': 40
        },
        'm_h2': {
            'sX': 120,
            'sY': 0,
            'sW': 50,
            'sH': 40
        },
        'm_can': {
            'sX': 50,
            'sY': 0,
            'sW': 70,
            'sH': 42
        },
        'm_jump': {
            'sX': 170,
            'sY': 0,
            'sW': 30,
            'sH': 30
        },
        'm_shot': {
            'sX': 210,
            'sY': 0,
            'sW': 50,
            'sH': 80
        }
    };
    function iu(Kx, Ky, KK, KO, Ku) {
        iB({
            'x': Kx.xi,
            'y': Kx.yi,
            'sz': Kx.sz
        }, Ky, KK, KO);
        let KW = iO[Ku];
        let KB = Nc['./images/mirny/mirnymobs.png'];
        NM.scale(Kx.facing, 1);
        NM.drawImage(KB, KW.sX, KW.sY, KW.sW, KW.sH, -KW.sW / 2, -KW.sH / 2, KW.sW, KW.sH);
        NM.resetTransform();
        ix(Kx, Ky, KK);
    }
    function iW(Kx, Ky, KK, KO) {
        NM.rotate(Math.PI / 4 * Math.sin(Nq.GAME_TICK / 10));
        NM.beginPath();
        NM.moveTo(0, 0);
        NM.lineTo(50, 0);
        NM.lineTo(35, 20);
        NM.fill();
        NM.stroke();
        NM.rotate(-2 * Math.PI / 4 * Math.sin(Nq.GAME_TICK / 10));
        NM.moveTo(0, 0);
        NM.lineTo(-50, 0);
        NM.lineTo(-35, 20);
        NM.fill();
        NM.stroke();
        NM.rotate(Math.PI / 4 * Math.sin(Nq.GAME_TICK / 10));
        NM.scale(Kx.facing, 1);
        NM.beginPath();
        NM.arc(0, 0, 20, 0, Math.PI * 2);
        NM.fill();
        NM.stroke();
        ih(-5, -5, 20, 6);
    }
    function iB(Kx, Ky, KK, KO) {
        iw(Kx.x, Kx.y, Kx.sz, [255, 100, 0, 0.4], KO, {
            'e': 1
        });
    }
    let il = function(Kx, Ky) {
        NM.lineTo(Kx * (Math.PI / 180), Ky * (Math.PI / 180));
    };
    let is = Kx => {
        return Kx * (Math.PI / 180);
    }
    ;
    function iZ(Kx, Ky, KK, KO, Ku) {
        let KW = [{
            'x': 104,
            'y': 25,
            'w': 26,
            'h': 38,
            'offset': -13
        }, {
            'x': 160,
            'y': 26,
            'w': 26,
            'h': 36,
            'offset': -13
        }, {
            'x': 132,
            'y': 27,
            'w': 26,
            'h': 36,
            'offset': -13
        }, {
            'x': 160,
            'y': 26,
            'w': 26,
            'h': 36,
            'offset': 13
        }];
        NM.translate(Math.round((Kx - KK.x) * Ku) + NQ.width / 2, Math.round((Ky - KK.y) * Ku) + NQ.height / 2);
        NM.scale(KO / 26 * Nq.scale, KO / 26 * Nq.scale);
        NM.filter = 'hue-rotate(200deg)';
        let KB = KW[Math.round(Date.now() / 80) % KW.length];
        NM.drawImage(Nc['./images/weapons.png'], KB.x, KB.y, KB.w, KB.h, KB.offset, -KB.h / 2, KB.w * Math.sign(KB.offset) * -1, KB.h);
        NM.filter = 'none';
        NM.resetTransform();
    }
    function ip(Kx, Ky, KK, KO, Ku) {
        let KW = [{
            'x': 104,
            'y': 25,
            'w': 26,
            'h': 38,
            'offset': -13
        }, {
            'x': 160,
            'y': 26,
            'w': 26,
            'h': 36,
            'offset': -13
        }, {
            'x': 132,
            'y': 27,
            'w': 26,
            'h': 36,
            'offset': -13
        }, {
            'x': 160,
            'y': 26,
            'w': 26,
            'h': 36,
            'offset': 13
        }];
        NM.translate(Math.round((Kx - KK.x) * Ku) + NQ.width / 2, Math.round((Ky - KK.y) * Ku) + NQ.height / 2);
        NM.scale(KO / 26 * Nq.scale, KO / 26 * Nq.scale);
        let KB = KW[Math.round(Date.now() / 80) % KW.length];
        NM.drawImage(Nc['./images/weapons.png'], KB.x, KB.y, KB.w, KB.h, KB.offset, -KB.h / 2, KB.w * Math.sign(KB.offset) * -1, KB.h);
        NM.resetTransform();
    }
    function ih(Kx, Ky, KK, KO) {
        NM.fillStyle = 'black';
        NM.beginPath();
        NM.arc(Kx, Ky, KO, 0, 2 * Math.PI);
        NM.fill();
        NM.beginPath();
        NM.arc(Kx + KK, Ky, KO, 0, 2 * Math.PI);
        NM.fill();
        NM.fillStyle = 'white';
        NM.beginPath();
        NM.arc(Kx + KO / 3, Ky - KO / 3, KO / 3, 0, 2 * Math.PI);
        NM.fill();
        NM.beginPath();
        NM.arc(Kx + KK + KO / 3, Ky - KO / 3, KO / 3, 0, 2 * Math.PI);
        NM.fill();
    }
    function ig(Kx, Ky, KK, KO) {
        let Ku = Nq.GAME_TICK / 15;
        let KW = 10;
        let KB = Kx.sz / 50;
        let Kl = (Kp, Kh, Kg) => {
            let Kr = Kp;
            Kp *= KW;
            Kp += Ku + Kx.angle;
            let KD = Math.abs(Math.sin(Kp * Math.PI / 360 + Math.PI / 4) ** 4);
            Kp *= Math.PI / 180;
            KD++;
            return {
                'x': Kx.squishX * Kh * KD * Math.cos(Kp) + KB * Math.sin(Kr * KW * 3 * (Math.PI / 180)) * Math.cos(Ku) * 3,
                'y': Kx.y + Kx.squishY * Kh * Math.sin(Kp) + KB * Math.cos(Kr * KW * 4 * (Math.PI / 180)) * Math.sin(Ku) * 3
            };
        }
        ;
        let Ks = (Kp, Kh) => {
            NM.beginPath();
            NM.moveTo(Kl(0, Kp, Kh).x, Kl(0, Kp, Kh).y);
            for (let Kg = 1; Kg < 360 / KW; Kg++) {
                NM.lineTo(Kl(Kg, Kp, Kh).x, Kl(Kg, Kp, Kh).y);
            }
        }
        ;
        NM.strokeStyle = ir(Kx.col, 60);
        NM.lineWidth = 5;
        NM.fillStyle = ir(Kx.col, 30);
        Ks(Kx.sz / 1.5 * (3 / 5), Kx.sz / 1.5 * (3 / 4));
        NM.fill();
        NM.fillStyle = Kx.col;
        Ks(Kx.sz / 1.5, Kx.sz / 1.5);
        NM.fill();
        let KZ = Math.min(Math.round(Kx.sz / 10) - 1, 15);
        NM.closePath();
        NM.lineJoin = 'bevel';
        NM.lineWidth = KZ;
        NM.globalAlpha = 1;
        NM.stroke();
    }
    function ir(Kx, Ky) {
        let KK = '#';
        for (let KO = 0; KO < 6; KO += 2) {
            let Ku = parseInt(Kx.substring(KO + 1, KO + 3), 16) - Ky;
            if (Ku > 255)
                Ku = 255;
            Ku = Ku < 0 ? '00' : Ku.toString(16);
            if (Ku.length == 1)
                Ku = '0' + Ku;
            KK += Ku;
        }
        return KK;
    }
    function iD(Kx, Ky) {
        let KK = '#';
        for (let KO = 0; KO < 6; KO += 2) {
            let Ku = Math.round(parseInt(Kx.substring(KO + 1, KO + 3), 16) / 3 * 2 + 254 / 3);
            if (Ku > 255)
                Ku = 255;
            Ku = Ku < 0 ? '00' : Ku.toString(16);
            if (Ku.length == 1)
                Ku = '0' + Ku;
            KK += Ku;
        }
        return KK;
    }
    function iQ() {
        if (Nq.notif == null)
            return;
        Nt.font = '40px quicksand';
        let Kx = Nt.measureText(Nq.notif.msg).width;
        Nt.fillStyle = 'rgba(0, 0, 0, 0.35)';
        Nt.fillRect(NQ.width / 2 - Kx / 2 - 10, NQ.height / 4 * 3 - 35, Kx + 20, 40);
        Nt.fillStyle = Nq.notif.color;
        Nt.fillText(Nq.notif.msg, NQ.width / 2 - Kx / 2, NQ.height / 4 * 3);
    }
    function iM() {
        for (let Kx = 0; Kx < Nq.notifs.length; Kx++) {
            Nt.font = '20px arial';
            let Ky = Nt.measureText(Nq.notifs[Kx].msg).width;
            Nt.fillStyle = 'rgba(0, 0, 0, 0.35)';
            Nt.fillRect(1920 - 20 - Ky, Kx * 35 + 20, Ky, 30);
            Nt.fillStyle = Nq.notifs[Kx].color;
            Nt.fillText(Nq.notifs[Kx].msg, 1920 - 20 - Ky, Kx * 35 + 42);
        }
    }
    function iY(Kx, Ky, KK, KO, Ku) {
        let KW = Ku ?? 0;
        let KB = Kx.x + Ky;
        let Kl = Kx.y + KK;
        let Ks = 2 * (Kx.sz - 5) / 3 - KW;
        let KZ = 1 * (Kx.sz - 5) / 3 - KW;
        NM.fillStyle = '#E8EEFF';
        NM.strokeStyle = '#c3c8d8';
        NM.beginPath();
        NM.ellipse(KB, Kl, Ks, KZ, 0, 0, 2 * Math.PI);
        NM.fill();
        NM.stroke();
        let Kp = Ks / 2 * iX(KO.x, KO.y, KB - Ky, Kl - KK).x;
        let Kh = KZ / 2 * iX(KO.x, KO.y, KB - Ky, Kl - KK).y;
        NM.fillStyle = '#000000';
        NM.beginPath();
        NM.ellipse(KB + (isNaN(Kp) || Kp == null ? 0 : Kp), Kl + (isNaN(Kh) || Kh == null ? 0 : Kh), Ks / 2.5, KZ / 2.5, 0, 0, 2 * Math.PI);
        NM.fill();
    }
    function iX(Kx, Ky, KK, KO) {
        let Ku = 180;
        if (Math.sign(KK - Kx) === -1)
            Ku = 0;
        let KW = Math.atan((KO - Ky) / (KK - Kx)) * (180 / Math.PI) + Ku;
        let KB = {
            'x': 0,
            'y': 0
        };
        KB.x = Math.cos(KW * (Math.PI / 180));
        KB.y = Math.sin(KW * (Math.PI / 180));
        KB.angle = KW;
        return KB;
    }
    function iE(Kx, Ky, KK) {
        return 'rgb(' + Math.round((Kx[0] * KK + Ky[0] * (100 - KK)) / 100) + ', ' + Math.round((Kx[1] * KK + Ky[1] * (100 - KK)) / 100) + ', ' + Math.round((Kx[2] * KK + Ky[2] * (100 - KK)) / 100) + ')';
    }
    function iv(Kx, Ky, KK=16, KO=2) {
        for (let Ku = 0; Ku < Ky.length - 1; Ku++) {
            const KW = Ku / (Ky.length - 2);
            Kx.lineWidth = KK + (KO - KK) * KW;
            Kx.beginPath();
            Kx.moveTo(Ky[Ku].x, Ky[Ku].y);
            Kx.lineTo(Ky[Ku + 1].x, Ky[Ku + 1].y);
            Kx.stroke();
        }
    }
    const ie = (( () => {
        let Kx = {
            'shard': (Ky, KK, KO, Ku, KW) => {
                NM.fillStyle = Ky.c;
                let KB = Date.now() - Ky.start;
                for (let Kl = 0; Kl < 5; Kl++) {
                    let Ks = parseInt(Ky.seed.toString()[2 + Kl]);
                    let KZ = (Kl - 2) * (KB / 50);
                    let Kp = (KB / 50 - (3 + Ks)) ** 2 - (3 + Ks) ** 2;
                    NM.beginPath();
                    NM.arc(KZ, Kp, 7, 0, Math.PI * 2);
                    NM.fill();
                }
                if (Ky.start + 1500 < Date.now())
                    Ky['delete'] = !![];
            }
            ,
            'drain': Ky => {
                const KK = Ky.time ?? 1100;
                const KO = Date.now() - Ky.start;
                const Ku = Math.min(KO / KK, 1);
                const KW = Nq.players[Ky.bind];
                if (KW == null) {
                    Ky['delete'] = !![];
                    return;
                }
                const KB = xI(KW);
                const Kl = xa(KW);
                const Ks = Ky.x - KB;
                const KZ = Ky.y - Kl;
                const Kp = Ky.count ?? 10;
                for (let Kh = 0; Kh < Kp; Kh++) {
                    const Kg = Kh / Kp * 0.22;
                    const Kr = Math.max(0, Math.min(1, (Ku - Kg) / (1 - Kg)));
                    const KD = Math.min(Kr / 0.68, 1);
                    const KQ = KD * KD * (3 - 2 * KD);
                    const KM = Math.max(0, (Kr - 0.28) / 0.72);
                    const KY = Math.atan2(KZ, Ks) + Ky.seed * Math.PI * 2 + Kh * 2.39996;
                    const KX = Kh % 2 === 0 ? 1 : -1;
                    const KE = KY + KX * KM * Math.PI * 1.35;
                    const Kv = Math.max(0, (Kr - 0.72) / 0.28);
                    const Ke = Kv * Kv * (3 - 2 * Kv);
                    const KL = (28 + Kh % 4 * 6) * (1 - Ke);
                    const KS = Math.cos(KE) * KL;
                    const KA = Math.sin(KE) * KL * 0.65;
                    const Kk = Ks * (1 - KQ) + KS * KQ;
                    const Ko = KZ * (1 - KQ) + KA * KQ;
                    const KT = 5 + Kh % 3;
                    const KJ = Math.max(0, (Kr - 0.28) / 0.72);
                    NM.globalAlpha = Math.min(1, Kr * 6) * (1 - KJ);
                    NM.fillStyle = ir(Ky.c, 70);
                    NM.beginPath();
                    NM.arc(Kk, Ko, KT + 3, 0, Math.PI * 2);
                    NM.fill();
                    NM.fillStyle = Ky.c;
                    NM.beginPath();
                    NM.arc(Kk, Ko, KT, 0, Math.PI * 2);
                    NM.fill();
                }
                NM.globalAlpha = 1;
                if (KO >= KK)
                    Ky['delete'] = !![];
            }
            ,
            'circle': (Ky, KK, KO, Ku) => {
                NM.strokeStyle = Ky.c;
                NM.lineWidth = 3;
                let KW = Date.now() - Ky.start;
                let KB = (500 - KW) / 500;
                if (KB < 0)
                    KB = 0;
                NM.globalAlpha = KB;
                NM.beginPath();
                NM.arc(0, 0, Ky.radius, 0, Math.PI * 2);
                NM.stroke();
                NM.globalAlpha = 1;
                if (Ky.start + 500 < Date.now())
                    Ky['delete'] = !![];
            }
            ,
            'shimmer': (Ky, KK, KO, Ku) => {
                if (Ky.start + 2000 < Date.now()) {
                    Ky['delete'] = !![];
                    return;
                }
                NM.fillStyle = Ky.c;
                NM.globalAlpha = 0.8;
                let KW = Date.now() - Ky.start;
                let KB = -KW / 200 + 11;
                for (let Kl = 0; Kl < 20; Kl++) {
                    let Ks = (KW / 50) ** 1.5 * Math.cos(360 / 20 * Kl * Math.PI / 180);
                    let KZ = (KW / 50) ** 1.5 * Math.sin(360 / 20 * Kl * Math.PI / 180);
                    NM.fillRect(Ks, KZ, KB, KB);
                }
                for (let Kp = 0; Kp < 20; Kp++) {
                    let Kh = (KW / 50) ** 1.5 * Math.cos(360 / 20 * Kp * Math.PI / 180) / 2;
                    let Kg = (KW / 50) ** 1.5 * Math.sin(360 / 20 * Kp * Math.PI / 180) / 2;
                    NM.fillRect(Kh, Kg, KB, KB);
                }
                NM.globalAlpha = 1;
            }
            ,
            'inverse-shimmer': (Ky, KK, KO, Ku) => {
                if (Ky.start + 1000 < Date.now()) {
                    Ky['delete'] = !![];
                    return;
                }
                NM.fillStyle = Ky.c;
                NM.globalAlpha = 0.8;
                let KW = Ky;
                let KB = Date.now() - Ky.start;
                let Kl = -KB / 50 + 22;
                let Ks = -KB + 1000;
                for (let KZ = 0; KZ < 20; KZ++) {
                    let Kp = Ks * Math.cos(360 / 20 * KZ * Math.PI / 180);
                    let Kh = Ks * Math.sin(360 / 20 * KZ * Math.PI / 180);
                    NM.fillRect(Kp, Kh, Kl, Kl);
                    NP.fillStyle = 'white';
                    NP.fillRect(KW.x + Kp + KK / 2 - 2, (KW.y + Kh + KO) / 2 - 2, Kl / 2 + 4, Kl / 2 + 4);
                }
                NM.globalAlpha = 1;
            }
            ,
            'firework': (Ky, KK, KO, Ku) => {
                NM.globalAlpha = 0.8;
                let KW = Ky;
                let KB = Date.now() - Ky.start;
                NM.fillStyle = iE([255, 0, 0], [255, 255, 0], KB / 1800 * 100);
                let Kl = -KB / 200 + 14;
                for (let Ks = 0; Ks < 20; Ks++) {
                    let KZ = parseInt(Ky.seed.toString()[2 + Ks]);
                    let Kp = ((KB / 50 - (3 + KZ)) ** 2 - (3 + KZ) ** 2) / 4;
                    let Kh = (KB / 50) ** 1.8 * Math.cos(360 / 20 * Ks * Math.PI / 180);
                    let Kg = (KB / 50) ** 1.8 * Math.sin(360 / 20 * Ks * Math.PI / 180) + Kp;
                    NM.fillRect(Kh, Kg, Kl, Kl);
                }
                for (let Kr = 0; Kr < 20; Kr++) {
                    let KD = parseInt(Ky.seed.toString()[2 + Kr]);
                    let KQ = ((KB / 50 - (3 + KD)) ** 2 - (3 + KD) ** 2) / 4;
                    let KM = (KB / 50) ** 1.8 * Math.cos(360 / 20 * Kr * Math.PI / 180) / 2;
                    let KY = (KB / 50) ** 1.8 * Math.sin(360 / 20 * Kr * Math.PI / 180) / 2 + KQ;
                    NM.fillRect(KM, KY, Kl, Kl);
                }
                NM.globalAlpha = 1;
                if (Ky.start + 2500 < Date.now())
                    Ky['delete'] = !![];
            }
            ,
            'text': (Ky, KK, KO, Ku) => {
                let KW = 40 * Ky.seed - 20 + 90;
                let KB = Date.now() - Ky.start;
                NM.lineWidth = 2;
                let Kl = 4 * Math.log(KB / 8);
                NM.font = 'bold 35px Quicksand';
                NM.fillStyle = Ky.c;
                NM.strokeStyle = Ky.outline;
                if (Ky.outline == null)
                    NM.strokeStyle = ir(Ky.c, 80);
                NM.strokeText(Ky.text, 0, 0 - Kl);
                NM.fillText(Ky.text, 0, 0 - Kl);
                if (Ky.start + (Ky.time ?? 2500) < Date.now())
                    Ky['delete'] = !![];
            }
            ,
            'impact': Ky => {
                const KK = 230;
                const KO = Date.now() - Ky.start;
                const Ku = Math.min(KO / KK, 1);
                const KW = 1 - Math.pow(1 - Ku, 3);
                const KB = Math.sqrt(Math.min(60, Ky.damage)) * 30 * (0.35 + 0.65 * KW);
                NM.globalAlpha = (1 - Ku) * 0.65;
                NM.rotate(Ky.seed * Math.PI * 2);
                NM.drawImage(Nc['./images/impact.png'], -KB / 2, -KB / 2, KB, KB);
                NM.globalAlpha = 1;
                if (KO >= KK)
                    Ky['delete'] = !![];
            }
            ,
            'circle2': (Ky, KK, KO, Ku) => {
                NM.fillStyle = Ky.c;
                NM.beginPath();
                NM.arc(0, 0, Ky.r, 0, Math.PI * 2);
                NM.fill();
                if (Ky.start + 2000 < Date.now())
                    Ky['delete'] = !![];
            }
            ,
            'lightning': Ky => {
                const KK = Ky.time ?? 750;
                const KO = Date.now() - Ky.start;
                const Ku = Math.min(KO / KK, 1);
                const KW = Ky.count ?? 20;
                const KB = Ky.spread ?? 40;
                const Kl = (Ky.x2 ?? Ky.x) - Ky.x;
                const Ks = (Ky.y2 ?? Ky.y) - Ky.y;
                const KZ = Math.hypot(Kl, Ks) || 1;
                const Kp = {
                    'x': -Ks / KZ,
                    'y': Kl / KZ
                };
                const Kh = KQ => {
                    let KM = KQ >>> 0;
                    KM += 1831565813;
                    KM = Math.imul(KM ^ KM >>> 15, KM | 1);
                    KM ^= KM + Math.imul(KM ^ KM >>> 7, KM | 61);
                    return ((KM ^ KM >>> 14) >>> 0) / 4294967296;
                }
                ;
                const Kg = (KQ, KM) => Kh(Math.floor((Ky.seed ?? 0) * 4294967296) + Math.imul(KQ + 1, 2654435761) + Math.imul(KM + 1, 2246822507));
                NM.fillStyle = Ky.fill ?? Ky.c ?? '#000000';
                NM.strokeStyle = Ky.outline ?? '#20e6d8';
                NM.globalAlpha = 1 - Ku ** 4;
                NM.lineCap = 'round';
                NM.lineJoin = 'round';
                let Kr = Ky.thickness ?? 2;
                let KD = Ky.taper ?? 1;
                for (let KQ = 0; KQ < 2; KQ++) {
                    let KM = [];
                    for (let KY = 0; KY < KW; KY++) {
                        const KX = KW === 1 ? 0.5 : KY / (KW - 1);
                        const KE = (Kg(KY, 2) * 2 - 1) * KB;
                        const Kv = Kl * KX + Kp.x * KE;
                        const Ke = Ks * KX + Kp.y * KE;
                        const KL = Kg(KY, 3) * Math.PI * 2;
                        const KS = 6 + Kg(KY, 4) * 18;
                        const KA = 2 * Ku - Ku * Ku;
                        const Kk = Kv + Math.cos(KL) * KS * KA;
                        const Ko = Ke + Math.sin(KL) * KS * KA;
                        KM.push({
                            'x': Kk,
                            'y': Ko
                        });
                    }
                    iv(NM, KM, KD, Kr);
                    NM.strokeStyle = Ky.fill ?? Ky.c ?? 'black';
                    Kr = Kr / 2;
                    KD = KD / 2;
                }
                NM.globalAlpha = 1;
                if (KO >= KK)
                    Ky['delete'] = !![];
            }
            ,
            'line-scatter': Ky => {
                const KK = Ky.time ?? 750;
                const KO = Date.now() - Ky.start;
                const Ku = Math.min(KO / KK, 1);
                const KW = Ky.count ?? 20;
                const KB = Ky.spread ?? 40;
                const Kl = (Ky.x2 ?? Ky.x) - Ky.x;
                const Ks = (Ky.y2 ?? Ky.y) - Ky.y;
                const KZ = Math.hypot(Kl, Ks) || 1;
                const Kp = {
                    'x': -Ks / KZ,
                    'y': Kl / KZ
                };
                const Kh = Kr => {
                    let KD = Kr >>> 0;
                    KD += 1831565813;
                    KD = Math.imul(KD ^ KD >>> 15, KD | 1);
                    KD ^= KD + Math.imul(KD ^ KD >>> 7, KD | 61);
                    return ((KD ^ KD >>> 14) >>> 0) / 4294967296;
                }
                ;
                const Kg = (Kr, KD) => Kh(Math.floor((Ky.seed ?? 0) * 4294967296) + Math.imul(Kr + 1, 2654435761) + Math.imul(KD + 1, 2246822507));
                NM.fillStyle = Ky.fill ?? Ky.c ?? '#000000';
                NM.strokeStyle = Ky.outline ?? '#20e6d8';
                NM.lineWidth = 1.5;
                NM.globalAlpha = (1 - Ku) * 0.9;
                for (let Kr = 0; Kr < KW; Kr++) {
                    const KD = KW === 1 ? 0.5 : Kr / (KW - 1);
                    const KQ = (Kg(Kr, 2) * 2 - 1) * KB;
                    const KM = Kl * KD + Kp.x * KQ;
                    const KY = Ks * KD + Kp.y * KQ;
                    const KX = Kg(Kr, 3) * Math.PI * 2;
                    const KE = 6 + Kg(Kr, 4) * 18;
                    const Kv = 2 * Ku - Ku * Ku;
                    const Ke = KM + Math.cos(KX) * KE * Kv;
                    const KL = KY + Math.sin(KX) * KE * Kv;
                    const KS = 4 + Kg(Kr, 7) * 3;
                    NM.beginPath();
                    NM.arc(Ke, KL, KS, 0, Math.PI * 2);
                    NM.fill();
                    NM.stroke();
                }
                NM.globalAlpha = 1;
                if (KO >= KK)
                    Ky['delete'] = !![];
            }
            ,
            'debug': (Ky, KK, KO, Ku) => {
                NM.fillStyle = 'rgba(0, 0, 0, 0)';
                NM.lineWidth = 1;
                NM.strokeStyle = Ky.color ?? 'red';
                let KW = [];
                for (let KB in Ky.debug) {
                    let Kl = Ky.debug[KB];
                    KW.push({
                        'x': Kl.x,
                        'y': Kl.y
                    });
                }
                ii(KW);
                if (Ky.start + 30000 < Date.now())
                    Ky['delete'] = !![];
            }
            ,
            'firework_color': (Ky, KK, KO, Ku) => {
                NM.globalAlpha = 0.8;
                let KW = Ky;
                let KB = 2 * (Date.now() - Ky.start);
                NM.fillStyle = Ky.c;
                let Kl = -KB / 200 + 14;
                for (let Ks = 0; Ks < 20; Ks++) {
                    let KZ = parseInt(Ky.seed.toString()[2 + Ks]);
                    let Kp = ((KB / 50 - (3 + KZ)) ** 2 - (3 + KZ) ** 2) / 4;
                    let Kh = (KB / 50) ** 1.8 * Math.cos(360 / 20 * Ks * Math.PI / 180);
                    let Kg = (KB / 50) ** 1.8 * Math.sin(360 / 20 * Ks * Math.PI / 180) + Kp;
                    NM.fillRect(Kh, Kg, Kl, Kl);
                }
                for (let Kr = 0; Kr < 20; Kr++) {
                    let KD = parseInt(Ky.seed.toString()[2 + Kr]);
                    let KQ = ((KB / 50 - (3 + KD)) ** 2 - (3 + KD) ** 2) / 4;
                    let KM = (KB / 50) ** 1.8 * Math.cos(360 / 20 * Kr * Math.PI / 180) / 2;
                    let KY = (KB / 50) ** 1.8 * Math.sin(360 / 20 * Kr * Math.PI / 180) / 2 + KQ;
                    NM.fillRect(KM, KY, Kl, Kl);
                }
                NM.globalAlpha = 1;
                if (Ky.start + 800 < Date.now())
                    Ky['delete'] = !![];
            }
            ,
            'confetti': Ky => {
                const KK = Date.now() - Ky.start;
                const KO = Ky.time ?? 1500;
                const Ku = KK / 1000;
                NM.globalAlpha = Math.max(0, Math.min(1, (KO - KK) / 350));
                for (const KW of Ky.pieces ?? []) {
                    const KB = KW.vx * Ku;
                    const Kl = KW.vy * Ku + 260 * Ku * Ku;
                    NM.save();
                    NM.translate(KB, Kl);
                    NM.rotate(KW.rotation + KW.spin * Ku);
                    NM.fillStyle = KW.color;
                    NM.fillRect(-KW.size / 2, -KW.size / 3, KW.size, KW.size * 0.65);
                    NM.restore();
                }
                NM.globalAlpha = 1;
                if (KK >= KO)
                    Ky['delete'] = !![];
            }
        };
        return function(Ky, KK, KO, Ku, KW) {
            if (!Nq.settings.drawparticles)
                return;
            if (Ky.bind == null) {
                NM.translate(Math.round((Ky.x - Ku.x) * KW) + NQ.width / 2, Math.round((Ky.y - Ku.y) * KW) + NQ.height / 2);
            } else {
                let KB = Nq.players[Ky.bind];
                if (KB == null)
                    return;
                if (KB.hide)
                    return;
                NM.translate(Math.round((xI(KB) - Ku.x) * KW) + NQ.width / 2, Math.round((xa(KB) - Ku.y) * KW) + NQ.height / 2);
            }
            NM.scale(KW, KW);
            Kx[Ky.type](Ky, KK, KO, Ku, KW);
            NM.resetTransform();
        }
        ;
    }
    )());
    function iL(Kx) {
        let Ky = Kx.x % 1000;
        let KK = Kx.y % 1000;
        NM.strokeStyle = 'red';
        NM.lineWidth = 3;
        let KO = 1000;
        let Ku = 1000;
        for (let KW = 0; KW < 3; KW++) {
            NM.beginPath();
            NM.moveTo(KW * KO - Ky + NQ.width / 2, 0);
            NM.lineTo(KW * KO - Ky + NQ.width / 2, NQ.height);
            NM.stroke();
        }
        for (let KB = 0; KB < 3; KB++) {
            NM.beginPath();
            NM.moveTo(0, KB * Ku - KK + NQ.height / 2);
            NM.lineTo(NQ.width, KB * Ku - KK + NQ.height / 2);
            NM.stroke();
        }
    }
    function iS(Kx, Ky, KK, KO, Ku, KW, KB) {
        NM.translate(Kx + KK, Ky + KO);
        NM.scale(-KB, 1);
        NM.rotate(KW * Math.PI / 180);
        NM.fillStyle = '#454545';
        NM.fillRect(0, 0, 5, -120);
        NM.fillStyle = Ku;
        NM.lineWidth = 3;
        NM.strokeStyle = ir(Ku, 100);
        NM.beginPath();
        NM.moveTo(0, -150);
        for (let Kl = 1; Kl <= 20; Kl++) {
            NM.lineTo(Kl * 5 - 5, -150 + 4 * Math.sin(Kl / 2 + Nq.GAME_TICK / 10));
        }
        for (let Ks = 20; Ks > 0; Ks--) {
            NM.lineTo(Ks * 5 - 5, -100 + 4 * Math.sin(Ks / 2 + Nq.GAME_TICK / 10));
        }
        NM.closePath();
        NM.fill();
        NM.stroke();
        NM.resetTransform();
    }
    function iA(Kx, Ky, KK) {
        NM.fillStyle = '#444';
        NM.fillRect(Kx - 300, Ky - 150, 5, 180);
        NM.fillRect(Kx + 295, Ky - 150, 5, 180);
        NM.fillStyle = KK;
        NM.strokeStyle = ir(KK, 100);
        NM.fillRect(Kx - 300, Ky - 150, 600, 35);
        NM.strokeRect(Kx - 300, Ky - 150, 600, 35);
    }
    function ik(Kx, Ky, KK, KO=1) {
        NM.transform(KO * Math.cos(KK), KO * Math.sin(KK), KO * -Math.sin(KK), KO * Math.cos(KK), Kx, Ky);
    }
    function io() {
        NM.globalAlpha = 0.6;
        for (let Kx = 0; Kx < 4; Kx++) {
            let Ky = Math.sin(Date.now() / 700 + Kx * 231.231);
            ik(NQ.width / 2 + 100 + Kx * 70, -100, 0.6 - Kx * 0.2, 2 * Math.sin(2 * 3.1415 * Kx / 6) + 2 + Ky / 2);
            iT(0, 0, 0.7);
            NM.resetTransform();
        }
        NM.globalAlpha = 1;
    }
    function iT(Kx=0, Ky=0, KK=1) {
        NM.drawImage(Nc['./images/weapons.png'], 974, 0, 50, 182, Kx, Ky, 50 * KK, 182);
    }
    function iJ(Kx, Ky, KK, KO, Ku, KW, KB) {
        const Kl = Ky - KO;
        const Ks = Ky + KO;
        KW = Math.max(KW, Kl);
        KB = Math.min(KB, Ks);
        const KZ = (KW - Ky) / KO;
        const Kp = (KB - Ky) / KO;
        const Kh = Math.acos(Kp);
        const Kg = Math.acos(KZ);
        Kx.ellipse(Ky, KK, KO, Ku, 0, Kh, Kg);
        Kx.lineTo(KW, KK);
        Kx.ellipse(Ky, KK, KO, Ku, 0, -Kg, -Kh);
        Kx.lineTo(KB, KK);
    }
    function id(Kx, Ky, KK, KO) {
        const Ku = Math.floor((Kx - KK) / 100) * 100;
        const KW = Nq.mapwidth * 5;
        for (let KB = Ku; KB <= Kx + KK; KB += 100) {
            let Kl = Math.floor(Ky / 90 + 1) * Nq.mapwidth + Math.floor(KB / 100);
            if (Kl < 0)
                Kl = 0;
            let Ks = null;
            for (let KQ = 0; KQ < KW; KQ += Nq.mapwidth) {
                const KM = Nq.map[Kl + KQ];
                if (KM == null)
                    break;
                if (!KM.light && !KM.top) {
                    Ks = KM.y;
                    break;
                }
            }
            if (Ks == null)
                continue;
            let KZ = -KK;
            let Kp = KK;
            let Kh = Math.max(KB - Kx, KZ);
            let Kg = Math.min(KB - Kx + 100, Kp);
            let Kr = Ks - Ky + 8;
            NM.fillStyle = 'rgba(0, 0, 0, ' + Math.min(0.22, 0.22 - 0.22 * Kr / 500) + ')';
            let KD = Math.min(KK / 2, 6);
            NM.beginPath();
            if (KO === -1) {
                iJ(NM, 0, Kr, KK, KD, Kg * KO, Kh * KO);
            } else {
                iJ(NM, 0, Kr, KK, KD, Kh, Kg);
            }
            NM.fill();
        }
    }
    function iw(Kx, Ky, KK, KO, Ku, KW) {
        if (KW?.e == 1) {
            KK += Math.round(KK / 10 * Math.sin(Date.now() / 400));
        }
        if (KW?.e == 2) {
            if (Math.sin(Date.now() / 1000 + KW.rand) ** 8 > 0.97)
                return;
        }
        const KB = Ny(Kx, Ky, Ku, Nq.scale);
        KB.x += -Math.round(NQ.width / 2);
        KB.y += -Math.round(NQ.height / 2);
        NP.translate(KB.x / 2 + Math.round(Nw.width / 2), KB.y / 2 + Math.round(Nw.height / 2));
        NP.scale(KK / 250 * Nq.scale, KK / 250 * Nq.scale);
        if (KO[3] === 0) {
            const KZ = NP.globalCompositeOperation;
            const Kp = NP.globalAlpha;
            try {
                NP.globalCompositeOperation = 'destination-out';
                NP.globalAlpha = 1;
                NP.drawImage(Nc['./images/light/circle.png'], -250, -250);
            } finally {
                NP.globalAlpha = Kp;
                NP.globalCompositeOperation = KZ;
            }
            NP.resetTransform();
            return;
        }
        const Kl = NP.globalCompositeOperation;
        const Ks = NP.globalAlpha;
        try {
            NP.globalCompositeOperation = 'destination-out';
            NP.globalAlpha = 1;
            NP.drawImage(Nc['./images/light/circle.png'], -250, -250);
        } finally {
            NP.globalAlpha = Ks;
            NP.globalCompositeOperation = Kl;
        }
        if (KW?.noColor === !![]) {
            const Kh = NP.globalCompositeOperation;
            const Kg = NP.globalAlpha;
            try {
                NP.globalCompositeOperation = 'lighter';
                NP.globalAlpha = KO[3] * 0.9;
                NP.drawImage(Nc['./images/light/circle.png'], -250, -250);
            } finally {
                NP.globalAlpha = Kg;
                NP.globalCompositeOperation = Kh;
            }
        } else {
            const Kr = al(KO[0], KO[1], KO[2]);
            if (Kr == null) {
                NP.resetTransform();
                return;
            }
            const KD = NP.globalCompositeOperation;
            const KQ = NP.globalAlpha;
            try {
                NP.globalCompositeOperation = 'lighter';
                NP.globalAlpha = KO[3] * 0.9;
                NP.drawImage(Kr, -250, -250, 500, 500);
            } finally {
                NP.globalAlpha = KQ;
                NP.globalCompositeOperation = KD;
            }
        }
        NP.resetTransform();
    }
    function iP(Kx, Ky) {
        let KK = Kx += 1831565813;
        KK = Math.imul(KK ^ KK >>> 15, KK | 1);
        KK ^= KK + Math.imul(KK ^ KK >>> 7, KK | 61);
        return ((KK ^ KK >>> 14) >>> 0) % (Ky + 1);
    }
    function iH(Kx, Ky, KK, KO, Ku=0, KW=1, KB=![]) {
        let Kl = Kx.dt;
        if (KO.squishY == null)
            KO.squishY = 1;
        if (KO.squishV == null)
            KO.squishV = 0;
        if (Math.abs(Kx.dy) > 0) {
            if (KO.squishV < 0)
                KO.squishV = 0;
            KO.squishJump = !![];
            KO.squishV += 0.05 * Kl;
            KO.vDown = !![];
        } else if (!KO.squishJump) {
            if (KO.vDown) {
                KO.squishV -= 0.08 * Kl;
            } else {
                KO.squishV += 0.08 * Kl;
            }
        }
        if (Kx.dy == 0) {
            if (KO.squishJump)
                KO.squishV = 0;
            KO.squishJump = ![];
        }
        KO.squishY += KO.squishV;
        if (KO.squishV < -0.03)
            KO.squishV = -0.03;
        if (KO.squishV > 0.05)
            KO.squishV = 0.05;
        if (KO.squishY > 2)
            KO.squishY = 2;
        if (!KO.vDown && KO.squishY > 1)
            KO.squishY = 1;
        if (KO.squishY < 0.8) {
            KO.vDown = ![];
        }
        ig({
            'x': 0,
            'y': Kx.y,
            'col': Kx.col,
            'sz': Kx.sz - 4,
            'angle': 0,
            'squishY': KO.squishY,
            'squishX': 1 / KO.squishY
        }, 0, 0, Ky);
        NM.globalAlpha = 0.6;
        if (Ku == 0 && Math.sin(Date.now() / 500 + KO.rand) > 0.99)
            Ku = 3;
        let Ks = 1;
        let KZ = 1;
        if (KB) {
            Ks = KW * 1 / KO.squishY;
            KZ = KW * KO.squishY;
        }
        if (Ku !== -1)
            iC(Kx, [{
                'x': 1186 + 90 * Ku,
                'y': 0,
                'w': 88,
                'h': 58
            }], 1, 0, Kx.y, Kx.sz / 80, !![], null, Ks, KZ);
        NM.globalAlpha = 1;
    }
    const it = {
        'slime': function(Kx, Ky, KK, KO, Ku, KW) {
            NM.globalAlpha = 0.5;
            iH(Kx, KO, Ku, KW);
        },
        'mythicalooze': function(Kx, Ky, KK, KO, Ku, KW) {
            NM.globalAlpha = 0.5;
            let KB = (KZ, Kp) => {
                let Kh = Math.round(KZ(Nq.GAME_TICK / 30 + Kp) * 60 + 90).toString(16);
                if (Kh.length == 1)
                    Kh = '0' + Kh;
                return Kh;
            }
            ;
            let Kl = '#' + KB(Math.sin, 0) + KB(Math.cos, 15) + KB(Math.cos, 0);
            Kx.col = Kl;
            let Ks = Kx.dt;
            if (KW.squishY == null)
                KW.squishY = 1;
            if (KW.squishV == null)
                KW.squishV = 0;
            if (Math.abs(Kx.dy) > 0) {
                if (KW.squishV < 0)
                    KW.squishV = 0;
                KW.squishJump = !![];
                KW.squishV += 0.05 * Ks;
                KW.vDown = !![];
            } else if (!KW.squishJump) {
                if (KW.vDown) {
                    KW.squishV -= 0.08 * Ks;
                } else {
                    KW.squishV += 0.08 * Ks;
                }
            }
            if (Kx.dy == 0) {
                if (KW.squishJump)
                    KW.squishV = 0;
                KW.squishJump = ![];
            }
            KW.squishY += KW.squishV;
            if (KW.squishV < -0.03)
                KW.squishV = -0.03;
            if (KW.squishV > 0.05)
                KW.squishV = 0.05;
            if (KW.squishY > 2)
                KW.squishY = 2;
            if (!KW.vDown && KW.squishY > 1)
                KW.squishY = 1;
            if (KW.squishY < 0.8) {
                KW.vDown = ![];
            }
            ig({
                'x': 0,
                'y': Kx.y,
                'col': Kx.col,
                'sz': Kx.sz - 4,
                'angle': 0,
                'squishY': KW.squishY,
                'squishX': 1 / KW.squishY
            }, 0, 0, KO);
        },
        'bigooze': function(Kx, Ky, KK, KO, Ku, KW) {
            iC(Kx, [{
                'x': 1560,
                'y': 72,
                'w': 262,
                'h': 96
            }], 1, 0, -70);
            iC(Kx, [{
                'x': 1830,
                'y': 141,
                'w': 73,
                'h': 85
            }], 1, 0, -30, 1 + 0.1 * Math.sin(Date.now() / 300) ** 2, ![]);
            NM.globalAlpha = 0.5;
            iH({
                ...Kx,
                'y': -80
            }, KO, Ku, KW, -1);
            iC(Kx, [{
                'x': 1832,
                'y': 62,
                'w': 69,
                'h': 74
            }], 1, 0, -220, 1, ![]);
        },
        'shroomslime': function(Kx, Ky, KK, KO, Ku, KW) {
            iC(Kx, [{
                'x': 718,
                'y': 0,
                'w': 114,
                'h': 74
            }], 1, 0, -20, 1, ![]);
            NM.globalAlpha = 0.6;
            iH(Kx, KO, Ku, KW);
        },
        'lichenslime': function(Kx, Ky, KK, KO, Ku, KW) {
            iC(Kx, [{
                'x': 125,
                'y': 1034,
                'w': 80,
                'h': 86
            }], 1, 0, -20, 1, ![]);
            NM.globalAlpha = 0.6;
            iH(Kx, KO, Ku, KW);
        },
        'eyeslime': function(Kx, Ky, KK, KO, Ku, KW) {
            NM.globalAlpha = 0.6;
            iH(Kx, KO, Ku, KW, 7, 1.4, !![]);
        },
        'pineslime': function(Kx, Ky, KK, KO, Ku, KW) {
            iC(Kx, [{
                'x': 1080,
                'y': 0,
                'w': 104,
                'h': 64
            }], 1, 0, -20, 1, ![]);
            NM.globalAlpha = 0.6;
            iH(Kx, KO, Ku, KW);
        },
        'botanicslime': function(Kx, Ky, KK, KO, Ku, KW) {
            iC(Kx, [{
                'x': 996,
                'y': 0,
                'w': 86,
                'h': 68
            }], 1, 0, -20, 1, ![]);
            NM.globalAlpha = 0.5;
            iH(Kx, KO, Ku, KW);
        },
        'starslime': function(Kx, Ky, KK, KO, Ku, KW) {
            iC(Kx, [{
                'x': 834,
                'y': 0,
                'w': 162,
                'h': 140
            }], 1, 10, -20, 1, ![]);
            NM.globalAlpha = 0.6;
            iH(Kx, KO, Ku, KW);
        },
        'bat': function(Kx, Ky, KK, KO) {
            NM.fillStyle = '#776757';
            NM.lineWidth = 3;
            NM.strokeStyle = '#494036';
            iW(Kx, 0, 0, KO);
        },
        'bat_g': function(Kx, Ky, KK, KO) {
            iB({
                'x': Kx.xi,
                'y': Kx.yi,
                'sz': Kx.sz
            }, Ky, KK, KO);
            NM.fillStyle = '#f97c07';
            NM.lineWidth = 3;
            NM.strokeStyle = '#f9a04d';
            iW(Kx, 0, 0, KO);
        },
        'bat_s': function(Kx, Ky, KK, KO) {
            NM.fillStyle = '#330b20ff';
            NM.lineWidth = 3;
            NM.strokeStyle = '#200714';
            iW(Kx, 0, 0, KO);
        },
        'slime_g': function(Kx, Ky, KK, KO, Ku, KW) {
            iB({
                'x': Kx.xi,
                'y': Kx.yi,
                'sz': Kx.sz
            }, Ky, KK, KO);
            NM.globalAlpha = 0.6;
            iH(Kx, KO, Ku, KW);
        },
        'ss': function(Kx, Ky, KK, KO, Ku, KW) {
            NM.globalAlpha = 0.9;
            iH(Kx, KO, Ku, KW);
        },
        'rgbs': function(Kx, Ky, KK, KO, Ku, KW) {
            NM.globalAlpha = 0.5;
            let KB = (Ks, KZ) => {
                let Kp = Math.round(Ks(Nq.GAME_TICK / 30 + KZ) * 127 + 127).toString(16);
                if (Kp.length == 1)
                    Kp = '0' + Kp;
                return Kp;
            }
            ;
            let Kl = '#' + KB(Math.sin, 0) + KB(Math.cos, 15) + KB(Math.cos, 0);
            Kx.col = Kl;
            iH(Kx, KO, Ku, KW);
        },
        'm1': function(Kx, Ky, KK, KO) {
            NM.scale(Kx.facing, 1);
            let Ku = Kx.sz;
            NM.fillStyle = '#f9f9ea';
            NM.strokeStyle = '#d6d6c5';
            NM.lineWidth = 2;
            NM.fillRect(-Ku / 4, 15, Ku / 2, -Ku * 1.5);
            NM.strokeRect(-Ku / 4, 15, Ku / 2, -Ku * 1.5);
            NM.fillStyle = Kx.col;
            NM.strokeStyle = ir(Kx.col, 30);
            NM.beginPath();
            NM.arc(0, -Ku / 1.5, Ku / 1.2, Math.PI, Math.PI * 2);
            NM.fill();
            NM.stroke();
            ih(-5, -10, 15, 4);
            NM.resetTransform();
        },
        'd': function(Kx, Ky, KK, KO) {
            NM.strokeStyle = '#4cb24c';
            NM.lineWidth = 10;
            NM.beginPath();
            NM.moveTo(0, Kx.y + Kx.sz / 2);
            let Ku = Kx.x + Math.sin(Nq.GAME_TICK / 10) * 15;
            let KW = Kx.y - Kx.sz / 2;
            NM.quadraticCurveTo(0, Kx.y, Ku, KW);
            NM.stroke();
            NM.strokeStyle = '#58C958';
            NM.lineWidth = 8;
            NM.beginPath();
            NM.moveTo(0, Kx.y + Kx.sz / 2);
            NM.quadraticCurveTo(0, Kx.y, Ku, KW);
            NM.stroke();
            NM.fillStyle = 'rgba(255, 255, 255, 0.5)';
            NM.beginPath();
            NM.arc(Ku, KW, 18, 0, Math.PI * 2);
            NM.fill();
            NM.fillStyle = '#d1bfa9';
            NM.beginPath();
            NM.arc(Ku, KW, 4, 0, Math.PI * 2);
            NM.fill();
            NM.fillStyle = Kx.col;
            NM.strokeStyle = '#4cb24c';
            NM.lineWidth = 2;
            NM.beginPath();
            NM.ellipse(0 + 14, Kx.y + Kx.sz / 2 - 10, 14, 6, -30 * Math.PI / 180, 0, 2 * Math.PI);
            NM.stroke();
            NM.fill();
            NM.beginPath();
            NM.ellipse(0 - 14, Kx.y + Kx.sz / 2 - 10, 14, 6, -150 * Math.PI / 180, 0, 2 * Math.PI);
            NM.stroke();
            NM.fill();
        },
        'e': function(Kx, Ky, KK, KO) {
            NM.strokeStyle = '#4cb24c';
            NM.lineWidth = 10;
            NM.beginPath();
            NM.moveTo(0, Kx.y + Kx.sz / 2);
            let Ku = Kx.x + Math.sin(Nq.GAME_TICK / 10) * 25;
            let KW = Kx.y - Kx.sz / 2;
            NM.quadraticCurveTo(0, Kx.y - 40, Ku, KW - 50);
            NM.stroke();
            NM.strokeStyle = '#58C958';
            NM.lineWidth = 8;
            NM.beginPath();
            NM.moveTo(0, Kx.y + Kx.sz / 2);
            NM.quadraticCurveTo(0, Kx.y - 40, Ku, KW - 50);
            NM.stroke();
            NM.lineWidth = 2;
            iY({
                'x': Ku,
                'y': Kx.y - 65,
                'sz': 40
            }, 0, 0, KO);
            NM.fillStyle = '#58C958';
            NM.strokeStyle = '#4cb24c';
            NM.lineWidth = 2;
            NM.beginPath();
            NM.ellipse(0 + 14, Kx.y + Kx.sz / 2 - 10, 14, 6, -30 * Math.PI / 180, 0, 2 * Math.PI);
            NM.stroke();
            NM.fill();
            NM.beginPath();
            NM.ellipse(0 - 14, Kx.y + Kx.sz / 2 - 10, 14, 6, -150 * Math.PI / 180, 0, 2 * Math.PI);
            NM.stroke();
            NM.fill();
        },
        'sm': (Kx, Ky, KK, KO) => {
            iC(Kx, [{
                'x': 282,
                'y': 664,
                'w': 106,
                'h': 94
            }], 1);
        }
        ,
        't': (Kx, Ky, KK, KO) => {
            let Ku = Math.round((Date.now() + (Kx.id ?? 0) * 98362) % 1000 / 10) / 100;
            let KW = 4 * Ku / 3;
            if (Ku > 0.75)
                KW = -4 * Ku + 4;
            let KB = 0.2;
            iC(Kx, [{
                'x': 349,
                'y': 474,
                'w': 62,
                'h': 62
            }], 1, 0, 62 * (KB * KW) / 2, 1, ![], ![], 1, 1 - KB + KB * (1 - KW));
        }
        ,
        'p': (Kx, Ky, KK, KO) => {
            NM.scale(Kx.facing, 1);
            let Ku = Kx.sz;
            NM.fillStyle = '#545454';
            NM.strokeStyle = '#303030';
            NM.lineWidth = 4;
            NM.beginPath();
            NM.moveTo(Ku / 2 - 5, Ku / 2);
            NM.lineTo(-Ku / 2 + 5, Ku / 2);
            NM.quadraticCurveTo(-Ku / 2, -Ku / 2 - 4, 0, -Ku / 2 - 4);
            NM.quadraticCurveTo(Ku / 2, -Ku / 2 - 4, Ku / 2 - 5, Ku / 2);
            NM.closePath();
            NM.stroke();
            NM.fill();
            NM.beginPath();
            NM.moveTo(-20, 0);
            NM.lineTo(-15, 15);
            NM.lineTo(-10, 5);
            NM.stroke();
            NM.fillStyle = '#DDDDDD';
            NM.beginPath();
            NM.moveTo(Ku / 4 + 5, Ku / 2);
            NM.lineTo(-Ku / 4 + 5, Ku / 2);
            NM.quadraticCurveTo(-Ku / 4 + 5, 0, 0 + 5, 0);
            NM.quadraticCurveTo(Ku / 4 + 5, 0, Ku / 4 + 5, Ku / 2);
            NM.closePath();
            NM.fill();
            ih(-5, -10, 25, 7);
            NM.fillStyle = 'orange';
            NM.beginPath();
            NM.moveTo(Ku / 2 - 20, -Ku / 2 + 15);
            NM.lineTo(Ku / 2 - 7, -Ku / 2 + 20);
            NM.lineTo(Ku / 2 - 20, -Ku / 2 + 25);
            NM.fill();
            NM.beginPath();
            NM.arc(-4, Ku / 2 + 3, 5, 180 * Math.PI / 180, 360 * Math.PI / 180);
            NM.arc(17, Ku / 2 + 3, 5, 180 * Math.PI / 180, 360 * Math.PI / 180);
            NM.fill();
            NM.resetTransform();
        }
        ,
        'w': (Kx, Ky, KK, KO) => {
            NM.scale(Kx.facing * -1, 1);
            let Ku = 50;
            NM.fillStyle = '#7c7049';
            NM.strokeStyle = '#5b5236';
            NM.lineWidth = 5;
            NM.beginPath();
            NM.moveTo(0, Ku / 2);
            NM.quadraticCurveTo(-Ku / 2, Ku / 2, -Ku / 2, 0);
            NM.quadraticCurveTo(-Ku / 2, -Ku / 2, 0, -Ku / 2);
            NM.quadraticCurveTo(Ku / 2, -Ku / 2, Ku / 2, 0);
            NM.quadraticCurveTo(Ku / 2, 20, Ku / 2 + 20, 0);
            NM.quadraticCurveTo(Ku / 2 + 23, Ku / 4, Ku / 2 + 30, Ku / 3);
            NM.quadraticCurveTo(Ku / 2, Ku / 2, 0, Ku / 2);
            NM.stroke();
            NM.fill();
            NM.lineWidth = 2;
            NM.beginPath();
            NM.moveTo(10, 14);
            NM.quadraticCurveTo(15, 27, 20, 8);
            NM.stroke();
            NM.fillStyle = '#DDDDDD';
            NM.beginPath();
            NM.moveTo(-16, 3);
            NM.lineTo(-14, 20);
            NM.lineTo(-12, 3);
            NM.fill();
            NM.moveTo(-4, 3);
            NM.lineTo(-2, 20);
            NM.lineTo(0, 3);
            NM.fill();
            NM.lineWidth = 2;
            NM.beginPath();
            NM.moveTo(-20, 0);
            NM.quadraticCurveTo(-14, 5, -8, 0);
            NM.quadraticCurveTo(-2, 5, 4, 0);
            NM.stroke();
            NM.scale(-1, 1);
            ih(-5, -10, 25, 7);
            NM.resetTransform();
        }
        ,
        'm_h1': function(Kx, Ky, KK, KO) {
            iu(Kx, Ky, KK, KO, 'm_h1');
        },
        'm_h2': function(Kx, Ky, KK, KO) {
            iu(Kx, Ky, KK, KO, 'm_h2');
        },
        'm_shot': function(Kx, Ky, KK, KO) {
            iu(Kx, Ky, KK, KO, 'm_shot');
        },
        'm_jump': function(Kx, Ky, KK, KO) {
            iu(Kx, Ky, KK, KO, 'm_jump');
        },
        'm_can': function(Kx, Ky, KK, KO) {
            iu(Kx, Ky, KK, KO, 'm_can');
        },
        'm_fly': function(Kx, Ky, KK, KO) {
            NM.fillStyle = '#842a13';
            NM.lineWidth = 3;
            NM.strokeStyle = '#66200f';
            NM.rotate(Math.PI / 4 * Math.sin(Nq.GAME_TICK / 7));
            NM.beginPath();
            NM.moveTo(0, 0);
            NM.lineTo(50, 0);
            NM.lineTo(35, 20);
            NM.fill();
            NM.stroke();
            NM.rotate(-2 * Math.PI / 4 * Math.sin(Nq.GAME_TICK / 7));
            NM.beginPath();
            NM.moveTo(0, 0);
            NM.lineTo(-50, 0);
            NM.lineTo(-35, 20);
            NM.fill();
            NM.stroke();
            NM.rotate(Math.PI / 4 * Math.sin(Nq.GAME_TICK / 7));
            iu(Kx, Ky, KK, KO, 'm_can');
        },
        'int': function(Kx, Ky, KK, KO) {
            let Ku = Nc['./images/integral.png'];
            NM.scale(Kx.facing, 1);
            NM.drawImage(Ku, 0, 0, 100, 100, -50, -50, 100, 100);
            NM.resetTransform();
        },
        'der': function(Kx, Ky, KK, KO) {
            let Ku = Nc['./images/derivaitve.png'];
            NM.scale(Kx.facing, 1);
            NM.drawImage(Ku, 0, 0, 100, 100, -50, -50, 100, 100);
            NM.resetTransform();
        },
        'elephant': function(Kx, Ky, KK, KO, Ku, KW) {
            iR(Kx, Ky, KK, KO, {
                'x': 0,
                'y': 0,
                'w': 205,
                'h': 149
            }, {
                'x': 210,
                'y': 4,
                'w': 150,
                'h': 126
            }, KW);
        },
        'rhino': function(Kx, Ky, KK, KO, Ku, KW) {
            iR(Kx, Ky, KK, KO, {
                'x': 367,
                'y': 0,
                'w': 206,
                'h': 150
            }, {
                'x': 585,
                'y': 0,
                'w': 128,
                'h': 104
            }, KW);
        },
        'bird1': function(Kx, Ky, KK, KO) {
            iz({
                'x': 59,
                'y': 198,
                'w': 89,
                'h': 45
            }, Kx.rotation);
        },
        'conuranBody': function(Kx) {
            iz({
                'x': 59,
                'y': 153,
                'w': 72,
                'h': 44
            }, Kx.rotation);
        },
        'conuranTail': function(Kx) {
            iz({
                'x': 2,
                'y': 247,
                'w': 118,
                'h': 85
            }, Kx.rotation);
        },
        'viperHead': function(Kx, Ky, KK, KO) {
            iz({
                'x': 343,
                'y': 1026,
                'w': 81,
                'h': 48
            }, Kx.rotation);
        },
        'viperBody': function(Kx) {
            iz({
                'x': 276,
                'y': 1025,
                'w': 66,
                'h': 48
            }, Kx.rotation);
        },
        'viperTail': function(Kx) {
            iz({
                'x': 211,
                'y': 1028,
                'w': 65,
                'h': 44
            }, Kx.rotation);
        },
        'humHead': function(Kx, Ky, KK, KO) {
            iz({
                'x': 149,
                'y': 152,
                'w': 151,
                'h': 45
            }, Kx.rotation);
        },
        'humBody': function(Kx, Ky, KK, KO) {
            iz({
                'x': 149,
                'y': 198,
                'w': 62,
                'h': 45
            }, Kx.rotation);
        },
        'humTail': function(Kx, Ky, KK, KO) {
            iz({
                'x': 125,
                'y': 248,
                'w': 118,
                'h': 48
            }, Kx.rotation);
        },
        'pengHead': function(Kx, Ky, KK, KO) {
            iz({
                'x': 654,
                'y': 110,
                'w': 108,
                'h': 48
            }, Kx.rotation);
        },
        'pengBody': function(Kx, Ky, KK, KO) {
            iz({
                'x': 581,
                'y': 110,
                'w': 72,
                'h': 50
            }, Kx.rotation);
        },
        'pengTail': function(Kx, Ky, KK, KO) {
            iz({
                'x': 524,
                'y': 158,
                'w': 94,
                'h': 72
            }, Kx.rotation);
        },
        'blueBore': function(Kx, Ky, KK, KO) {
            iz({
                'x': 0,
                'y': 625,
                'w': 56,
                'h': 40
            }, Kx.rotation);
        },
        'wormy': function(Kx) {
            iz({
                'x': 3,
                'y': 402,
                'w': 150,
                'h': 220
            }, Kx.rotation);
        },
        'flyworm': function(Kx) {
            iz({
                'x': 414,
                'y': 640,
                'w': 80,
                'h': 64
            }, Kx.rotation);
        },
        'flywormWings': function(Kx) {
            iz({
                'x': 414,
                'y': 640,
                'w': 80,
                'h': 64
            }, Kx.rotation);
            ib(-10, -20, 10, 70);
            NM.scale(-1, -1);
            ib(-10, -20, 10, 70);
        },
        'tree1': function(Kx) {
            iC(Kx, [{
                'x': 242,
                'y': 348,
                'w': 42,
                'h': 50
            }], 1);
        },
        'snail': function(Kx) {
            iC(Kx, [{
                'x': 329,
                'y': 350,
                'w': 60,
                'h': 38
            }], 1);
        },
        'lichen': function(Kx) {
            iC(Kx, [{
                'x': 125,
                'y': 1034,
                'w': 80,
                'h': 86
            }], 1);
        },
        'treeAlpine': function(Kx) {
            iC(Kx, [{
                'x': 199,
                'y': 347,
                'w': 42,
                'h': 50
            }], 1);
        },
        'treeDry': function(Kx) {
            iC(Kx, [{
                'x': 149,
                'y': 348,
                'w': 50,
                'h': 50
            }], 1);
        },
        'treeSnow': function(Kx) {
            iC(Kx, [{
                'x': 285,
                'y': 348,
                'w': 42,
                'h': 50
            }], 1);
        },
        'treeJungle': function(Kx) {
            iC(Kx, [{
                'x': 710,
                'y': 254,
                'w': 44,
                'h': 44
            }], 1);
        },
        'barnacle': function(Kx) {
            iC(Kx, [{
                'x': 0,
                'y': 1576,
                'w': 60,
                'h': 50
            }], 1);
        },
        'egg': function(Kx) {
            iC(Kx, [{
                'x': 0,
                'y': 336,
                'w': 76,
                'h': 64
            }], 1);
        },
        'cargosac1': function(Kx) {
            iC(Kx, [{
                'x': 418,
                'y': 552,
                'w': 72,
                'h': 88
            }], 1);
        },
        'cargosac2': function(Kx) {
            iC(Kx, [{
                'x': 510,
                'y': 565,
                'w': 58,
                'h': 72
            }], 1);
        },
        'snootegg': function(Kx) {
            iC(Kx, [{
                'x': 77,
                'y': 346,
                'w': 66,
                'h': 54
            }], 1);
        },
        'tumbleweed': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 282,
                'y': 399,
                'w': 54,
                'h': 52
            }], 1);
        },
        'rollingcactus': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 1235,
                'y': 409,
                'w': 64,
                'h': 70
            }], 1);
        },
        'tumbleweedLarge': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 246,
                'y': 227,
                'w': 106,
                'h': 104
            }], 1);
        },
        'thornberry': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 218,
                'y': 437,
                'w': 42,
                'h': 44
            }], 1);
        },
        'thornberryLarge': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 337,
                'y': 388,
                'w': 82,
                'h': 82
            }], 1);
        },
        'pineneedle': function(Kx) {
            let Ky = Math.round((Date.now() + (Kx.id ?? 0) * 98362) % 1000 / 10) / 100;
            let KK = 4 * Ky / 3;
            if (Ky > 0.75)
                KK = -4 * Ky + 4;
            let KO = 0.2;
            iC(Kx, [{
                'x': 295,
                'y': 537,
                'w': 122,
                'h': 56
            }], 1, 0, 56 * (KO * KK) / 2, 1, ![], ![], 1, 1 - KO + KO * (1 - KK));
        },
        'pineneedle2': function(Kx) {
            let Ky = Math.round((Date.now() + (Kx.id ?? 0) * 98362) % 1000 / 10) / 100;
            let KK = 4 * Ky / 3;
            if (Ky > 0.75)
                KK = -4 * Ky + 4;
            let KO = 0.2;
            iC(Kx, [{
                'x': 295,
                'y': 601,
                'w': 122,
                'h': 58
            }], 1, 0, 58 * (KO * KK) / 2, 1, ![], ![], 1, 1 - KO + KO * (1 - KK));
        },
        'bloodBoulder': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 420,
                'y': 422,
                'w': 140,
                'h': 130
            }], 1);
        },
        'boulder': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 419,
                'y': 353,
                'w': 70,
                'h': 66
            }], 1);
        },
        'snowball': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 492,
                'y': 351,
                'w': 48,
                'h': 46
            }], 1);
        },
        'rat': function(Kx) {
            iC(Kx, [{
                'x': 158,
                'y': 400,
                'w': 124,
                'h': 36
            }], 1);
        },
        'cactus': function(Kx) {
            iC(Kx, [{
                'x': 1138,
                'y': 500,
                'w': 48,
                'h': 69
            }], 1);
        },
        'velvetSlug': function(Kx) {
            NM.scale(1 + 0.1 * Math.sin(Date.now() / 200), 1 + 0.05 * Math.cos(Date.now() / 200));
            iC(Kx, [{
                'x': 121,
                'y': 644,
                'w': 136,
                'h': 66
            }], 1);
        },
        'sliderslug': function(Kx) {
            NM.scale(1 + 0.1 * Math.sin(Date.now() / 200), 1 + 0.05 * Math.cos(Date.now() / 200));
            iC(Kx, [{
                'x': 152,
                'y': 592,
                'w': 144,
                'h': 44
            }], 1);
        },
        'bun': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 156, 482, KW);
        },
        'duneBun': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 220, 482, KW);
        },
        'bunnyGrass': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 220, 530, KW);
        },
        'bunnyForest': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 284, 482, KW);
        },
        'bunnyAlpine': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 156, 530, KW);
        },
        'jungleRabbit': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 713, 300, KW);
        },
        'babyconuran': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 914, 298, KW);
        },
        'chicken': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 850, 298, KW);
        },
        'duck': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 978, 298, KW);
        },
        'frog': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 1046, 296, KW);
        },
        'caecillian': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 783, 297, KW);
        },
        'bunnyDesert': function(Kx, Ky, KK, KO, Ku, KW) {
            iU(Kx, 1180, 297, KW);
        },
        'treecrab': function(Kx) {
            NM.scale(Kx.facing, 1);
            NM.translate(0, -20);
            let Ky = 15 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 15 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.translate(-35, 20);
            for (let KO = 0; KO < 3; KO++) {
                NM.rotate(Ky);
                iC(Kx, [{
                    'x': 111 + KO * 15,
                    'y': 1495,
                    'w': 15,
                    'h': 32
                }], 1, 0, 16, 1, ![]);
                NM.rotate(-Ky);
                NM.translate(20, 0);
            }
            NM.translate(35 - 20 * 3, -20);
            iC(Kx, [{
                'x': 62,
                'y': 1560,
                'w': 108,
                'h': 66
            }], 1, 0, 0, 1, ![]);
            NM.translate(-44, 0);
            NM.rotate(-Math.PI / 4);
            if (1) {
                iC(Kx, [{
                    'x': 0,
                    'y': 1100,
                    'w': 100,
                    'h': 270
                }], 1, 15, -110, 1, ![]);
            } else {
                iC(Kx, [{
                    'x': 71,
                    'y': 1441,
                    'w': 40,
                    'h': 88
                }], 1, 0, -38, 1, ![]);
            }
            NM.rotate(Math.PI / 4);
            NM.translate(44, 0);
            NM.translate(-45, 20);
            for (let Ku = 0; Ku < 3; Ku++) {
                NM.rotate(KK);
                iC(Kx, [{
                    'x': 111 + Ku * 15,
                    'y': 1495,
                    'w': 15,
                    'h': 32
                }], 1, 0, 16, 1, ![]);
                NM.rotate(-KK);
                NM.translate(20, 0);
            }
            NM.translate(45 - 20 * 3, -20);
        },
        'meerkat': function(Kx) {
            NM.translate(0, -11);
            let Ky = 15 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 15 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.scale(Kx.facing, 1);
            NM.translate(-5, 25);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 215,
                'y': 215,
                'w': 24,
                'h': 22
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-KK);
            NM.translate(5, -25);
            iC(Kx, [{
                'x': 214,
                'y': 200,
                'w': 36,
                'h': 12
            }], 1, -24, 20, 1, ![]);
            iC(Kx, [{
                'x': 300,
                'y': 134,
                'w': 30,
                'h': 70
            }], 1, 0, 0, 1, ![]);
            NM.translate(-5, 25);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 215,
                'y': 215,
                'w': 24,
                'h': 22
            }], 1, 0, 8, 1, ![]);
        },
        'meerkat2': function(Kx) {
            NM.translate(0, -11);
            let Ky = 15 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 15 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.scale(Kx.facing, 1);
            NM.translate(-5, 25);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1188,
                'y': 443,
                'w': 24,
                'h': 25
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-KK);
            NM.translate(5, -25);
            iC(Kx, [{
                'x': 1189,
                'y': 429,
                'w': 36,
                'h': 12
            }], 1, -24, 20, 1, ![]);
            iC(Kx, [{
                'x': 1149,
                'y': 429,
                'w': 30,
                'h': 70
            }], 1, 0, 0, 1, ![]);
            NM.translate(-5, 25);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1188,
                'y': 443,
                'w': 24,
                'h': 25
            }], 1, 0, 8, 1, ![]);
        },
        'penguin2': function(Kx) {
            NM.translate(0, -11);
            let Ky = 15 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 15 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.scale(Kx.facing, 1);
            NM.translate(-5, 25);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 859,
                'y': 146,
                'w': 24,
                'h': 22
            }], 1, 10, 20, 1.5, ![]);
            NM.rotate(-KK);
            NM.translate(5, -25);
            iC(Kx, [{
                'x': 823,
                'y': 146,
                'w': 37,
                'h': 75
            }], 1, 0, 5, 1, ![]);
            NM.translate(-5, 25);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 859,
                'y': 146,
                'w': 24,
                'h': 22
            }], 1, 10, 20, 1.5, ![]);
        },
        'toadstool': function(Kx) {
            NM.translate(0, 15);
            iC(Kx, [{
                'x': 482,
                'y': 220,
                'w': 36,
                'h': 30
            }], 1);
            iC(Kx, [{
                'x': 436,
                'y': 218,
                'w': 46,
                'h': 30
            }], 1, 0, -20 + 5 * Math.sin(Date.now() / 400), 1, ![]);
        },
        'parrotfish1': function(Kx) {
            iq(Kx, {
                'x': 214,
                'y': 1212,
                'w': 96,
                'h': 42
            }, 20, {
                'x': 310,
                'y': 1211,
                'w': 20,
                'h': 10
            });
        },
        'parrotfish2': function(Kx) {
            iq(Kx, {
                'x': 214,
                'y': 1257,
                'w': 96,
                'h': 42
            }, 20, {
                'x': 309,
                'y': 1258,
                'w': 20,
                'h': 10
            });
        },
        'bunnyfish1': function(Kx) {
            iq(Kx, {
                'x': 352,
                'y': 1203,
                'w': 96,
                'h': 48
            }, 22, {
                'x': 310,
                'y': 1220,
                'w': 18,
                'h': 10
            });
        },
        'bunnyfish2': function(Kx) {
            iq(Kx, {
                'x': 352,
                'y': 1251,
                'w': 96,
                'h': 48
            }, 22, {
                'x': 310,
                'y': 1230,
                'w': 18,
                'h': 10
            });
        },
        'angelfish': function(Kx) {
            iC(Kx, [{
                'x': 238,
                'y': 1299,
                'w': 78,
                'h': 142
            }], 1);
            let Ky = (1 + Math.sin(Date.now() / 70)) / 6;
            iC(Kx, [{
                'x': 238,
                'y': 1299,
                'w': -50,
                'h': 142
            }], 1, -78 / 2 - 25 * Ky - 24, 0, 1, ![], null, 1 + Ky);
        },
        'anglerfish': function(Kx, Ky, KK, KO) {
            iB({
                'x': Kx.xi,
                'y': Kx.yi,
                'sz': Kx.sz
            }, Ky, KK, KO);
            iq(Kx, {
                'x': 555,
                'y': 1080,
                'w': 140,
                'h': 100
            }, 20, {
                'x': 699,
                'y': 1117,
                'w': 101,
                'h': 25
            });
        },
        'shark': function(Kx) {
            iq(Kx, {
                'x': 520,
                'y': 1192,
                'w': 215,
                'h': 86
            }, 20, {
                'x': 322,
                'y': 1309,
                'w': 80,
                'h': 32
            });
        },
        'cargofly': function(Kx) {
            let Ky = 20 * Math.sin(Date.now() / 200) * Math.PI / 180;
            NM.scale(Kx.facing, 1);
            ib(15, -35, 10, 125, 0.55);
            iC(Kx, [{
                'x': 119,
                'y': 712,
                'w': 72,
                'h': 88
            }], 1, 0, 0, 1, ![]);
            for (let KK = 0; KK < 2; KK++) {
                NM.translate(-10, 35);
                NM.rotate(Ky);
                iC(Kx, [{
                    'x': 119,
                    'y': 800,
                    'w': 32,
                    'h': 50
                }], 1, 0, 25, 1, ![]);
                NM.rotate(-Ky);
                NM.translate(-20, -5);
                NM.rotate(Ky);
                iC(Kx, [{
                    'x': 119,
                    'y': 800,
                    'w': 32,
                    'h': 50
                }], 1, 0, 25, 1, ![]);
                NM.rotate(-Ky);
                NM.translate(30, -30);
                NM.scale(-1, 1);
            }
            ib(-20, -30, 10, 0, 0.7);
        },
        'cargowasp': function(Kx) {
            let Ky = 20 * Math.sin(Date.now() / 200) * Math.PI / 180;
            NM.scale(Kx.facing, 1);
            ib(5, -35, 10, 125, 0.55);
            iC(Kx, [{
                'x': 196,
                'y': 710,
                'w': 82,
                'h': 114
            }], 1, 17, 0, 1, ![]);
            for (let KK = 0; KK < 2; KK++) {
                NM.translate(-10, 40);
                NM.rotate(Ky);
                iC(Kx, [{
                    'x': 174,
                    'y': 852,
                    'w': 40,
                    'h': 74
                }], 1, 0, 35, 1, ![]);
                NM.rotate(-Ky);
                NM.translate(-10, -5);
                NM.rotate(Ky);
                iC(Kx, [{
                    'x': 174,
                    'y': 852,
                    'w': 40,
                    'h': 74
                }], 1, 0, 35, 1, ![]);
                NM.rotate(-Ky);
                NM.translate(30, -35);
                NM.scale(-1, 1);
            }
            ib(0, -30, 10, 0, 0.7);
        },
        'mink': function(Kx) {
            NM.translate(0, -8);
            NM.scale(Kx.facing, 1);
            let Ky = 20 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 20 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.translate(-25, 20);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 453,
                'y': 187,
                'w': 20,
                'h': 28
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-KK);
            NM.translate(34, 0);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 473,
                'y': 186,
                'w': 24,
                'h': 28
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(25 - 34, -20);
            let KO = 2 * Math.sin(Date.now() / 300);
            NM.translate(0, KO);
            iC(Kx, [{
                'x': 331,
                'y': 152,
                'w': 120,
                'h': 60
            }], 1, 0, 0, 1, ![]);
            iC(Kx, [{
                'x': 453,
                'y': 151,
                'w': 66,
                'h': 36
            }], 1, -66, 0, 1, ![]);
            NM.translate(0, -KO);
            NM.translate(-28, 20);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 453,
                'y': 187,
                'w': 20,
                'h': 28
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(40, 0);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 473,
                'y': 186,
                'w': 24,
                'h': 28
            }], 1, 0, 8, 1, ![]);
        },
        'mink2': function(Kx) {
            NM.translate(0, -8);
            NM.scale(Kx.facing, 1);
            let Ky = 20 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 20 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.translate(-25, 20);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1115,
                'y': 235,
                'w': 20,
                'h': 28
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-KK);
            NM.translate(34, 0);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1134,
                'y': 235,
                'w': 24,
                'h': 28
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(25 - 34, -20);
            let KO = 2 * Math.sin(Date.now() / 300);
            NM.translate(0, KO);
            iC(Kx, [{
                'x': 994,
                'y': 201,
                'w': 120,
                'h': 60
            }], 1, 0, 0, 1, ![]);
            iC(Kx, [{
                'x': 1115,
                'y': 201,
                'w': 66,
                'h': 36
            }], 1, -66, 0, 1, ![]);
            NM.translate(0, -KO);
            NM.translate(-28, 20);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1115,
                'y': 235,
                'w': 20,
                'h': 28
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(40, 0);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1134,
                'y': 235,
                'w': 24,
                'h': 28
            }], 1, 0, 8, 1, ![]);
        },
        'armadillo': function(Kx) {
            NM.translate(0, -8);
            NM.scale(Kx.facing, 1);
            let Ky = 20 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 20 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.translate(-25, 20);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 400,
                'y': 1169,
                'w': 26,
                'h': 22
            }], 1, 0, 0, 1, ![]);
            NM.rotate(-KK);
            NM.translate(34, 0);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 400,
                'y': 1169,
                'w': 26,
                'h': 22
            }], 1, 0, 0, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(25 - 34, -20);
            let KO = 2 * Math.sin(Date.now() / 300);
            NM.translate(0, KO);
            iC(Kx, [{
                'x': 397,
                'y': 1115,
                'w': 112,
                'h': 51
            }], 1, 0, 0, 1, ![]);
            iC(Kx, [{
                'x': 428,
                'y': 1172,
                'w': 41,
                'h': 13
            }], 1, -66, 10, 1, ![]);
            NM.translate(0, -KO);
            NM.translate(-28, 20);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 400,
                'y': 1169,
                'w': 26,
                'h': 22
            }], 1, 0, 0, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(40, 0);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 400,
                'y': 1169,
                'w': 26,
                'h': 22
            }], 1, 0, 0, 1, ![]);
        },
        'scorpion': function(Kx) {
            NM.translate(0, -8);
            NM.scale(Kx.facing, 1);
            let Ky = 20 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 20 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.translate(-25, 20);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1294,
                'y': 374,
                'w': 20,
                'h': 28
            }], 1, 10, 8, 1, ![]);
            iC(Kx, [{
                'x': 1294,
                'y': 374,
                'w': 20,
                'h': 28
            }], 1, -6, 8, 1, ![]);
            NM.rotate(-KK);
            NM.translate(34, 0);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1317,
                'y': 374,
                'w': 24,
                'h': 28
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(25 - 34, -20);
            let KO = 2 * Math.sin(Date.now() / 300);
            NM.translate(0, KO);
            iC(Kx, [{
                'x': 1186,
                'y': 361,
                'w': 109,
                'h': 35
            }], 1, 0, 15, 1, ![]);
            iC(Kx, [{
                'x': 1306,
                'y': 342,
                'w': 66,
                'h': 32
            }], 1, -60, 10, 1, ![]);
            NM.translate(0, -KO);
            NM.translate(-28, 20);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1294,
                'y': 374,
                'w': 20,
                'h': 28
            }], 1, 10, 8, 1, ![]);
            iC(Kx, [{
                'x': 1294,
                'y': 374,
                'w': 20,
                'h': 28
            }], 1, -6, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(40, 0);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1317,
                'y': 374,
                'w': 24,
                'h': 28
            }], 1, 0, 8, 1, ![]);
        },
        'scorpion2': function(Kx) {
            NM.translate(0, -8);
            NM.scale(Kx.facing, 1);
            let Ky = 20 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 20 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.translate(-25, 20);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1200,
                'y': 250,
                'w': 20,
                'h': 43
            }], 1, -30, 8, 1, ![]);
            iC(Kx, [{
                'x': 1200,
                'y': 250,
                'w': 20,
                'h': 43
            }], 1, 10, 8, 1, ![]);
            NM.rotate(-KK);
            NM.translate(34, 0);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1227,
                'y': 249,
                'w': 24,
                'h': 39
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(25 - 34, -20);
            let KO = 2 * Math.sin(Date.now() / 300);
            NM.translate(0, KO);
            iC(Kx, [{
                'x': 1193,
                'y': 195,
                'w': 163,
                'h': 51
            }], 1, 0, 15, 1, ![]);
            iC(Kx, [{
                'x': 1260,
                'y': 249,
                'w': 64,
                'h': 68
            }], 1, -90, -5, 1, ![]);
            NM.translate(0, -KO);
            NM.translate(-28, 20);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1200,
                'y': 250,
                'w': 20,
                'h': 43
            }], 1, -30, 8, 1, ![]);
            iC(Kx, [{
                'x': 1200,
                'y': 250,
                'w': 20,
                'h': 43
            }], 1, 10, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(40, 0);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1227,
                'y': 249,
                'w': 24,
                'h': 39
            }], 1, 0, 8, 1, ![]);
        },
        'scorpion3': function(Kx) {
            NM.translate(0, -8);
            NM.scale(Kx.facing, 1);
            let Ky = 20 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 20 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.translate(-25, 20);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1368,
                'y': 250,
                'w': 20,
                'h': 43
            }], 1, -30, 8, 1, ![]);
            iC(Kx, [{
                'x': 1368,
                'y': 250,
                'w': 20,
                'h': 43
            }], 1, 10, 8, 1, ![]);
            NM.rotate(-KK);
            NM.translate(34, 0);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1393,
                'y': 249,
                'w': 24,
                'h': 39
            }], 1, 0, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(25 - 34, -20);
            let KO = 2 * Math.sin(Date.now() / 300);
            NM.translate(0, KO);
            iC(Kx, [{
                'x': 1358,
                'y': 195,
                'w': 163,
                'h': 51
            }], 1, 0, 15, 1, ![]);
            iC(Kx, [{
                'x': 1422,
                'y': 249,
                'w': 64,
                'h': 68
            }], 1, -90, -5, 1, ![]);
            NM.translate(0, -KO);
            NM.translate(-28, 20);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 1368,
                'y': 250,
                'w': 20,
                'h': 43
            }], 1, -30, 8, 1, ![]);
            iC(Kx, [{
                'x': 1368,
                'y': 250,
                'w': 20,
                'h': 43
            }], 1, 10, 8, 1, ![]);
            NM.rotate(-Ky);
            NM.translate(40, 0);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 1393,
                'y': 249,
                'w': 24,
                'h': 39
            }], 1, 0, 8, 1, ![]);
        },
        'spider': function(Kx) {
            NM.translate(0, -8);
            NM.scale(Kx.facing, 1);
            let Ky = 20 * Math.sin(Date.now() / 100) * Math.PI / 180;
            let KK = 20 * Math.sin(Date.now() / 100 + 180) * Math.PI / 180;
            if (Kx.dx == 0) {
                Ky = 0;
                KK = 0;
            }
            NM.translate(-25, 20);
            NM.rotate(KK);
            iC(Kx, [{
                'x': 233,
                'y': 1594,
                'w': 167,
                'h': 51
            }], 1, 30, -40, 1.25, ![]);
            iC(Kx, [{
                'x': 233,
                'y': 1594,
                'w': 167,
                'h': 51
            }], 1, -6, -40, 1.25, ![]);
            NM.rotate(-KK);
            let KO = 2 * Math.sin(Date.now() / 300);
            NM.translate(0, KO);
            iC(Kx, [{
                'x': 234,
                'y': 1556,
                'w': 120,
                'h': 35
            }], 1, 0, -25, 1.75, ![]);
            NM.translate(0, -KO);
            NM.translate(-28, 20);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 233,
                'y': 1594,
                'w': 167,
                'h': 51
            }], 1, 30, -40, 1.25, ![]);
            iC(Kx, [{
                'x': 233,
                'y': 1594,
                'w': 167,
                'h': 51
            }], 1, -6, -40, 1.25, ![]);
            NM.rotate(-Ky);
        },
        'snoot1': function(Kx) {
            iC(Kx, [{
                'x': 0,
                'y': 677,
                'w': 119,
                'h': 56
            }, {
                'x': 0,
                'y': 678 + 56,
                'w': 119,
                'h': 56
            }, {
                'x': 0,
                'y': 678 + 56 + 56,
                'w': 119,
                'h': 56
            }], 200);
        },
        'iceshroom': function(Kx) {
            iC(Kx, [{
                'x': 480,
                'y': 273,
                'w': 36,
                'h': 44
            }, {
                'x': 519,
                'y': 273,
                'w': 36,
                'h': 44
            }, {
                'x': 557,
                'y': 273,
                'w': 36,
                'h': 44
            }], 200);
        },
        'snoot2': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.rotation == null)
                KW.rotation = 0;
            KW.rotation -= Math.abs(KW.rotation - Kx.dx / 100) / 20 * Math.sign(KW.rotation - Kx.dx / 100);
            if (Math.abs(KW.rotation - Kx.dx / 100) < 0.01)
                KW.rotation = Kx.dx / 100;
            NM.rotate(KW.rotation);
            iC(Kx, [{
                'x': 0,
                'y': 952,
                'w': 380,
                'h': 72
            }], 1);
            ib(40, -16, 20);
            NM.translate(80, 25);
            let KB = Nc['./images/mobsmap.png'];
            for (let Kl = 0; Kl < 3; Kl++) {
                NM.rotate(Math.PI / 12 * Math.sin(Date.now() / 180 + Kl * 80));
                NM.drawImage(KB, 0, 1021, 52, 64, -52, 0, 52, 64);
                NM.rotate(-Math.PI / 6);
            }
        },
        'wasp': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.rotation == null)
                KW.rotation = 0;
            let KB = Kx.dx;
            if (KB > 20)
                KB = 20;
            KW.rotation -= Math.abs(KW.rotation - KB / 100) / 20 * Math.sign(KW.rotation - KB / 100);
            if (Math.abs(KW.rotation - KB / 100) < 0.01)
                KW.rotation = KB / 100;
            NM.rotate(KW.rotation);
            NM.scale(-1, 1);
            iC(Kx, [{
                'x': 380,
                'y': 928,
                'w': 86,
                'h': 66
            }], 1);
            ib(30, -14, 20, 120, 0.4);
        },
        'butterfly': function(Kx, Ky, KK, KO, Ku, KW, KB) {
            if (KW.rotation == null)
                KW.rotation = 0;
            let Kl = Kx.dt;
            let Ks = Kx.dx;
            if (Ks > 20)
                Ks = 20;
            KW.rotation -= Math.abs(KW.rotation - Ks / 10) / 20 * Math.sign(KW.rotation - Ks / 10) * Kl;
            if (Math.abs(KW.rotation - Ks / 10) < 0.01)
                KW.rotation = Ks / 10;
            NM.rotate(-KW.rotation);
            let KZ = (KB.id - 109) * 42;
            if (KB.id == 118)
                KZ = 4 * 42;
            let Kp = Math.sin((Date.now() + Kx.id * 20.2134) / 100);
            iC(Kx, [{
                'x': 1056 + KZ,
                'y': 160,
                'w': 37,
                'h': 14
            }], 1);
            NM.scale(1, (Kp + 1) / 2 + 0.2);
            iC(Kx, [{
                'x': 1052 + KZ,
                'y': 130,
                'w': 40,
                'h': 29
            }], 1, 0, -(Kp + 1) * 6, 1, ![]);
        },
        'bosserfly': function(Kx, Ky, KK, KO, Ku, KW, KB, Kl) {
            if (KW.rotation == null)
                KW.rotation = 0;
            let Ks = Kx.dx;
            if (Ks > 20)
                Ks = 20;
            KW.rotation -= Math.abs(KW.rotation - Ks / 100) / 20 * Math.sign(KW.rotation - Ks / 100);
            if (Math.abs(KW.rotation - Ks / 100) < 0.01)
                KW.rotation = Ks / 100;
            NM.rotate(-KW.rotation);
            NM.scale(-Kx.facing, 1);
            let KZ = -Kx.facing;
            let Kp = -KW.rotation;
            let Kh = Math.sin((Date.now() + Kx.id * 20.2134) / 250);
            let Kg = (Kh + 1) / 2;
            let Kr = (Math.sin((Date.now() + Kx.id * 20.2134) / 70) + 1) / 2;
            NM.translate(-90, -25);
            NM.rotate(Kg / 2);
            iC(Kx, [{
                'x': 911,
                'y': 442,
                'w': 197,
                'h': 27
            }], 1, -90, 0, 1, ![]);
            NM.rotate(Kg / 9 + 0.1);
            iC(Kx, [{
                'x': 911,
                'y': 442,
                'w': 197,
                'h': 27
            }], 1, -90, 0, 1, ![]);
            NM.rotate(-Kg / 9 + 0.1 - Kg / 2);
            NM.translate(90, 25);
            iC(Kx, [{
                'x': 985,
                'y': 478,
                'w': 121,
                'h': 74
            }], 1, 0, 0, 1, ![]);
            NM.translate(-55, -15);
            NM.rotate(-Kg / 2);
            iC(Kx, [{
                'x': 912,
                'y': 476,
                'w': 68,
                'h': 56
            }], 1, -20, 0, 1, ![]);
            NM.rotate(Kg / 2);
            NM.translate(55, 15);
            NM.translate(55, 0);
            NM.rotate(Kg / 6);
            iC(Kx, [{
                'x': 907,
                'y': 559,
                'w': 203,
                'h': 62
            }], 1, 90, 0, 1, ![]);
            NM.rotate(-Kg / 6);
            NM.translate(-55, 0);
            NM.translate(20, -15);
            NM.scale(1, Math.sin(Kr) + 0.1);
            iC(Kx, [{
                'x': 903,
                'y': 626,
                'w': 266,
                'h': 450
            }], 1, 0, -450 / 2, 1, ![]);
            NM.scale(1, Kr ** 2 / 3 + Kr / 2 + 0.1 / (Math.sin(Kr) + 0.1));
            iC(Kx, [{
                'x': 1169,
                'y': 629,
                'w': 353,
                'h': 238
            }], 1, 110, -238 / 2, 1, ![]);
            for (let KD = 0; KD < 3; KD++) {
                let KQ = -(Math.sin(Date.now() / (170 + KD * 30) + KD * 2) + 1) / 4 + Math.PI / 3 - KD ** 3 * 0.2;
                ic(-(30 - KD * 30) * Ku * KZ, 30 * Ku, -KQ * KZ, Ku, Ku, -Kp, Kl.x, Kl.y);
                iC(Kx, [{
                    'x': 1117,
                    'y': 441,
                    'w': 14,
                    'h': 66
                }], 1, 0, 33, 1, ![]);
                ic(-(30 - KD * 30 - 66 * Math.cos(KQ + Math.PI / 2)) * Ku * KZ, (30 + 66 * Math.sin(KQ + Math.PI / 2)) * Ku, 0, Ku, Ku, -Kp, Kl.x, Kl.y);
                iC(Kx, [{
                    'x': 1118,
                    'y': 509,
                    'w': 14,
                    'h': 44
                }], 1, 0, 18, 1, ![]);
            }
        },
        'fruitfly': function(Kx, Ky, KK, KO, Ku, KW, KB, Kl) {
            if (KW.rotation == null)
                KW.rotation = 0;
            let Ks = Kx.dx;
            if (Ks > 20)
                Ks = 20;
            KW.rotation -= Math.abs(KW.rotation - Ks / 100) / 20 * Math.sign(KW.rotation - Ks / 100);
            if (Math.abs(KW.rotation - Ks / 100) < 0.01)
                KW.rotation = Ks / 100;
            NM.rotate(-KW.rotation);
            NM.scale(-Kx.facing, 1);
            let KZ = -Kx.facing;
            let Kp = -KW.rotation;
            let Kh = Math.sin((Date.now() + Kx.id * 20.2134) / 250);
            let Kg = (Kh + 1) / 2;
            let Kr = (Math.sin((Date.now() + Kx.id * 20.2134) / 70) + 1) / 2;
            NM.translate(-90, -25);
            NM.rotate(Kg / 2);
            iC(Kx, [{
                'x': 911,
                'y': 442,
                'w': 197,
                'h': 27
            }], 1, -90, 0, 1, ![]);
            NM.rotate(Kg / 9 + 0.1);
            iC(Kx, [{
                'x': 911,
                'y': 442,
                'w': 197,
                'h': 27
            }], 1, -90, 0, 1, ![]);
            NM.rotate(-Kg / 9 + 0.1 - Kg / 2);
            NM.translate(90, 25);
            iC(Kx, [{
                'x': 985,
                'y': 478,
                'w': 121,
                'h': 74
            }], 1, 0, 0, 1, ![]);
            NM.translate(-55, -15);
            NM.rotate(-Kg / 2);
            iC(Kx, [{
                'x': 912,
                'y': 476,
                'w': 68,
                'h': 56
            }], 1, -20, 0, 1, ![]);
            NM.rotate(Kg / 2);
            NM.translate(55, 15);
            NM.translate(55, 0);
            NM.rotate(Kg / 6);
            iC(Kx, [{
                'x': 907,
                'y': 559,
                'w': 203,
                'h': 62
            }], 1, 90, 0, 1, ![]);
            NM.rotate(-Kg / 6);
            NM.translate(-55, 0);
            NM.translate(20, -15);
            NM.scale(1, Math.sin(Kr) + 0.1);
            iC(Kx, [{
                'x': 903,
                'y': 626,
                'w': 266,
                'h': 450
            }], 1, 0, -450 / 2, 1, ![]);
            NM.scale(1, Kr ** 2 / 3 + Kr / 2 + 0.1 / (Math.sin(Kr) + 0.1));
            iC(Kx, [{
                'x': 1169,
                'y': 629,
                'w': 353,
                'h': 238
            }], 1, 110, -238 / 2, 1, ![]);
            for (let KD = 0; KD < 3; KD++) {
                let KQ = -(Math.sin(Date.now() / (170 + KD * 30) + KD * 2) + 1) / 4 + Math.PI / 3 - KD ** 3 * 0.2;
                ic(-(30 - KD * 30) * Ku * KZ, 30 * Ku, -KQ * KZ, Ku, Ku, -Kp, Kl.x, Kl.y);
                iC(Kx, [{
                    'x': 1117,
                    'y': 441,
                    'w': 14,
                    'h': 66
                }], 1, 0, 33, 1, ![]);
                ic(-(30 - KD * 30 - 66 * Math.cos(KQ + Math.PI / 2)) * Ku * KZ, (30 + 66 * Math.sin(KQ + Math.PI / 2)) * Ku, 0, Ku, Ku, -Kp, Kl.x, Kl.y);
                iC(Kx, [{
                    'x': 1118,
                    'y': 509,
                    'w': 14,
                    'h': 44
                }], 1, 0, 18, 1, ![]);
            }
        },
        'virus': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.rotation == null)
                KW.rotation = 0;
            KW.rotation += Math.sign(Kx.dx) * Math.hypot(Kx.dx, Kx.dy) / 200;
            NM.rotate(KW.rotation);
            iC(Kx, [{
                'x': 710,
                'y': 352,
                'w': 102,
                'h': 102
            }], 1);
        },
        'desertvirus': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.rotation == null)
                KW.rotation = 0;
            KW.rotation += Math.sign(Kx.dx) * Math.hypot(Kx.dx, Kx.dy) / 200;
            NM.rotate(KW.rotation);
            iC(Kx, [{
                'x': 710,
                'y': 555,
                'w': 102,
                'h': 98
            }], 1);
        },
        'bulb': function(Kx, Ky, KK, KO, Ku, KW) {
            iC(Kx, [{
                'x': 1191,
                'y': 479,
                'w': 114,
                'h': 56
            }], 1);
        },
        'bulb2': function(Kx, Ky, KK, KO, Ku, KW) {
            let KB = 20 * Math.sin(Date.now() / 100) * Math.PI / 180;
            iC(Kx, [{
                'x': 602,
                'y': 858,
                'w': 250,
                'h': 130
            }], 1, 0, -20, 1);
            NM.save();
            NM.rotate(KB);
            iC(Kx, [{
                'x': 499,
                'y': 867,
                'w': 101,
                'h': 126
            }], 1, 0, -20, 1);
            NM.restore();
            NM.save();
            NM.restore();
            iC(Kx, [{
                'x': 483,
                'y': 990,
                'w': 237,
                'h': 85
            }], 1, 0, 8, 1);
        },
        'alpineFloater': function(Kx) {
            iC(Kx, [{
                'x': 0,
                'y': 1673,
                'w': 152,
                'h': 162
            }], 1);
            NM.translate(0, -90);
            let Ky = Math.abs(Kx.dy / 40) + 0.4;
            Ky = Math.sin(Date.now() / 400) / 4 + 0.6;
            NM.scale(1, Ky);
            iC(Kx, [{
                'x': 0,
                'y': 1836,
                'w': 333,
                'h': 120
            }], 1, 0, 60);
            NM.scale(1, 1 / Ky);
            iC(Kx, [{
                'x': 0,
                'y': 1625,
                'w': 190,
                'h': 47
            }], 1);
        },
        'alpineCyst': function(Kx) {
            iC(Kx, [{
                'x': 118,
                'y': 1966,
                'w': 82,
                'h': 82
            }], 1, 0, 30);
            let Ky = Math.sin(Date.now() / 400) / 7 + 1;
            NM.scale(1 / Ky, Ky);
            iC(Kx, [{
                'x': 4,
                'y': 1966,
                'w': 110,
                'h': 78
            }], 1, 0, 0);
        },
        'mint': function(Kx) {
            iC(Kx, [{
                'x': 306,
                'y': 761,
                'w': 48,
                'h': 82
            }], 1, 0, 0);
            let Ky = Math.round(30 * Math.sin(Date.now() / 300 + 23)) * Math.PI / 180;
            let KK = Math.round(30 * Math.cos(Date.now() / 400 + 23)) * Math.PI / 180;
            NM.translate(0, -10);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 362,
                'y': 763,
                'w': 48,
                'h': 58
            }], 1, 16, -58 / 2, 1);
            NM.rotate(-Ky + KK);
            iC(Kx, [{
                'x': 362,
                'y': 763,
                'w': 48,
                'h': 58
            }], 1, 16, -58 / 2, 1, ![], !![]);
        },
        'mint2': function(Kx) {
            iC(Kx, [{
                'x': 411,
                'y': 745,
                'w': 60,
                'h': 103
            }], 1, 0, -25);
            NM.translate(14, 18 - 50);
            let Ky = Math.sin(Date.now() / 500) / 5 + 1;
            let KK = Math.cos(Date.now() / 400) / 5 + 1;
            NM.scale(Ky, KK);
            iC(Kx, [{
                'x': 478,
                'y': 744,
                'w': 32,
                'h': 36
            }], 1, 0, 0, 1);
            NM.scale(1 / Ky, 1 / KK);
            NM.translate(-14 - 10, -18 + 50 + 13 - 20);
            NM.scale(KK, Ky);
            iC(Kx, [{
                'x': 478,
                'y': 784,
                'w': 28,
                'h': 26
            }], 1, 0, 0);
        },
        'squid': function(Kx) {
            NM.translate(-25, 20);
            let Ky = Math.round(30 * Math.sin(Date.now() / 300 + 23)) * Math.PI / 180;
            let KK = Math.round(35 * Math.sin(Date.now() / 300 + 24) + 20) * Math.PI / 180;
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 46,
                'y': 1372,
                'w': 20,
                'h': 70
            }], 1, 0, 35);
            NM.rotate(-Ky + KK);
            iC(Kx, [{
                'x': 46,
                'y': 1372,
                'w': 20,
                'h': 70
            }], 1, 0, 35);
            NM.rotate(-KK);
            NM.translate(50, 0);
            NM.scale(-1, 1);
            NM.rotate(Ky);
            iC(Kx, [{
                'x': 46,
                'y': 1372,
                'w': 20,
                'h': 70
            }], 1, 0, 35);
            NM.rotate(-Ky + KK);
            iC(Kx, [{
                'x': 46,
                'y': 1372,
                'w': 20,
                'h': 70
            }], 1, 0, 35);
            NM.rotate(-KK);
            NM.scale(-1, 1);
            NM.translate(-25, -20);
            iC(Kx, [{
                'x': 0,
                'y': 1442,
                'w': 70,
                'h': 72
            }], 1);
            NM.translate(-16, 23);
            let KO = Math.round(30 * Math.sin(Date.now() / 400 + 123)) * Math.PI / 180;
            NM.rotate(KO);
            iC(Kx, [{
                'x': 71,
                'y': 1371,
                'w': 20,
                'h': 70
            }], 1, 0, 35);
            NM.rotate(-KO);
            NM.translate(16 * 2, 0);
            NM.scale(-1, 1);
            let Ku = Math.round(30 * Math.sin(Date.now() / 450 + 223)) * Math.PI / 180;
            NM.rotate(Ku);
            iC(Kx, [{
                'x': 71,
                'y': 1371,
                'w': 20,
                'h': 70
            }], 1, 0, 35);
            NM.rotate(-Ku);
            NM.scale(-1, 1);
            NM.translate(-16, -23);
            iC(Kx, [{
                'x': 0,
                'y': 1100,
                'w': 100,
                'h': 270
            }], 1, 15, -270 / 2);
        },
        'ostrich': function(Kx) {
            NM.translate(0, -20);
            NM.scale(Kx.facing, 1);
            iC(Kx, [{
                'x': 544,
                'y': 324,
                'w': 98,
                'h': 48
            }], 1, 0, 0, 1, ![]);
        },
        'brickZ': function(Kx) {
            iC(Kx, [{
                'x': 624,
                'y': 197,
                'w': 86,
                'h': 80
            }], 1);
        },
        'tendonZ': function(Kx) {
            iC(Kx, [{
                'x': 722,
                'y': 159,
                'w': 50,
                'h': 38
            }], 1);
            NM.rotate(0.2 * Math.sin(Date.now() / 400));
            iC(Kx, [{
                'x': 622,
                'y': 160,
                'w': 100,
                'h': 30
            }], 1, -50, 0, 1, ![]);
        },
        'egg': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.renderScale == null)
                KW.renderScale = -0.5;
            if (Math.sign(Kx.dy) == -1) {
                KW.renderScale += 0.15;
            } else {
                KW.renderScale -= 0.03;
            }
            if (KW.renderScale > 1)
                KW.renderScale = 1;
            if (KW.renderScale < 0.5)
                KW.renderScale = 0.5;
            let KB = 1.5 - KW.renderScale;
            let Kl = 20 * x0(10 * Math.sin(Date.now() / 1000), 0, 1);
            iC(Kx, [{
                'x': 644,
                'y': 424,
                'w': 26,
                'h': 22
            }], 1, 0, -30 * (2 - KB) + (20 - Kl));
            NM.fillStyle = 'black';
            NM.beginPath();
            let Ks = 6 * x0(Math.sin(Date.now() / 200) * 10, -1, 1);
            NM.arc(Ks, -30 * (2 - KB) + (20 - Kl), 4, 0, Math.PI * 2);
            NM.fill();
            NM.scale(KB, 2 - KB);
            iC(Kx, [{
                'x': 644,
                'y': 552,
                'w': 60,
                'h': 48
            }], 1);
            iC(Kx, [{
                'x': 643,
                'y': 498,
                'w': 56,
                'h': 30
            }], 1, 0, -30 - Kl);
        },
        'present': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.renderScale == null)
                KW.renderScale = -0.5;
            if (Math.sign(Kx.dy) == -1) {
                KW.renderScale += 0.15;
            } else {
                KW.renderScale -= 0.03;
            }
            if (KW.renderScale > 1)
                KW.renderScale = 1;
            if (KW.renderScale < 0.5)
                KW.renderScale = 0.5;
            let KB = 1.5 - KW.renderScale;
            let Kl = 20 * x0(10 * Math.sin(Date.now() / 1000), 0, 1);
            iC(Kx, [{
                'x': 644,
                'y': 424,
                'w': 26,
                'h': 22
            }], 1, 0, -30 * (2 - KB) + (20 - Kl));
            NM.fillStyle = 'black';
            NM.beginPath();
            let Ks = 6 * x0(Math.sin(Date.now() / 200) * 10, -1, 1);
            NM.arc(Ks, -30 * (2 - KB) + (20 - Kl), 4, 0, Math.PI * 2);
            NM.fill();
            NM.scale(KB, 2 - KB);
            iC(Kx, [{
                'x': 644,
                'y': 448,
                'w': 60,
                'h': 50
            }], 1);
            iC(Kx, [{
                'x': 643,
                'y': 387,
                'w': 56,
                'h': 34
            }], 1, 0, -34 - Kl);
        },
        'present_i': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.renderScale == null)
                KW.renderScale = -0.5;
            if (Math.sign(Kx.dy) == -1) {
                KW.renderScale += 0.15;
            } else {
                KW.renderScale -= 0.03;
            }
            if (KW.renderScale > 1)
                KW.renderScale = 1;
            if (KW.renderScale < 0.5)
                KW.renderScale = 0.5;
            let KB = 1.5 - KW.renderScale;
            let Kl = 20 * x0(10 * Math.sin(Date.now() / 1000), 0, 1);
            iC(Kx, [{
                'x': 721,
                'y': 688,
                'w': 26,
                'h': 22
            }], 1, 0, -30 * (2 - KB) + (20 - Kl));
            NM.fillStyle = 'black';
            NM.beginPath();
            let Ks = 6 * x0(Math.sin(Date.now() / 200) * 10, -1, 1);
            NM.arc(Ks, -30 * (2 - KB) + (20 - Kl), 4, 0, Math.PI * 2);
            NM.fill();
            NM.scale(KB, 2 - KB);
            iC(Kx, [{
                'x': 720,
                'y': 711,
                'w': 60,
                'h': 50
            }], 1);
            iC(Kx, [{
                'x': 721,
                'y': 653,
                'w': 56,
                'h': 34
            }], 1, 0, -34 - Kl);
        },
        'pumpkin': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.renderScale == null)
                KW.renderScale = -0.5;
            if (Math.sign(Kx.dy) == -1) {
                KW.renderScale += 0.15;
            } else {
                KW.renderScale -= 0.03;
            }
            if (KW.renderScale > 1)
                KW.renderScale = 1;
            if (KW.renderScale < 0.5)
                KW.renderScale = 0.5;
            let KB = 1.5 - KW.renderScale;
            let Kl = 20 * x0(10 * Math.sin(Date.now() / 1000), 0, 1);
            iC(Kx, [{
                'x': 644,
                'y': 648,
                'w': 26,
                'h': 22
            }], 1, 0, -30 * (2 - KB) + (20 - Kl));
            NM.fillStyle = 'black';
            NM.beginPath();
            let Ks = 6 * x0(Math.sin(Date.now() / 200) * 10, -1, 1);
            NM.arc(Ks, -30 * (2 - KB) + (20 - Kl), 4, 0, Math.PI * 2);
            NM.fill();
            NM.scale(KB, 2 - KB);
            iC(Kx, [{
                'x': 644,
                'y': 672,
                'w': 60,
                'h': 50
            }], 1);
            iC(Kx, [{
                'x': 643,
                'y': 606,
                'w': 56,
                'h': 40
            }], 1, 0, -34 - Kl);
        },
        'pumpkin_s': function(Kx, Ky, KK, KO, Ku, KW) {
            if (KW.renderScale == null)
                KW.renderScale = -0.5;
            if (Math.sign(Kx.dy) == -1) {
                KW.renderScale += 0.15;
            } else {
                KW.renderScale -= 0.03;
            }
            if (KW.renderScale > 1)
                KW.renderScale = 1;
            if (KW.renderScale < 0.5)
                KW.renderScale = 0.5;
            let KB = 1.5 - KW.renderScale;
            let Kl = 20 * x0(10 * Math.sin(Date.now() / 1000), 0, 1);
            iC(Kx, [{
                'x': 644,
                'y': 648,
                'w': 26,
                'h': 22
            }], 1, 0, -30 * (2 - KB) + (20 - Kl));
            NM.fillStyle = 'black';
            NM.beginPath();
            let Ks = 6 * x0(Math.sin(Date.now() / 200) * 10, -1, 1);
            NM.arc(Ks, -30 * (2 - KB) + (20 - Kl), 4, 0, Math.PI * 2);
            NM.fill();
            NM.scale(KB, 2 - KB);
            iC(Kx, [{
                'x': 644,
                'y': 792,
                'w': 60,
                'h': 50
            }], 1);
            iC(Kx, [{
                'x': 643,
                'y': 726,
                'w': 56,
                'h': 40
            }], 1, 0, -34 - Kl);
        },
        'gutsZ': function(Kx) {
            iF(-5, 10, 20, 0, 1, {
                'x': 751,
                'y': 202,
                'w': 62,
                'h': 35
            });
            iF(5, 10, 20, 0, 1, {
                'x': 751,
                'y': 202,
                'w': 62,
                'h': 35
            }, -1);
            iC(Kx, [{
                'x': 713,
                'y': 198,
                'w': 32,
                'h': 56
            }], 1);
        },
        'brodyZ': function(Kx, Ky, KK, KO, Ku, KW) {
            iC(Kx, [{
                'x': 644,
                'y': 318,
                'w': 66,
                'h': 66
            }], 1, 0, 0, 1, ![]);
            if (KW.legAngle == null)
                KW.legAngle = -0.5;
            if (Math.sign(Kx.dy) == -1) {
                KW.legAngle += 0.3;
            } else {
                KW.legAngle -= 0.1;
            }
            if (KW.legAngle > 1)
                KW.legAngle = 1;
            if (KW.legAngle < -0.5)
                KW.legAngle = -0.5;
            let KB = KW.legAngle + 0.1 * Math.sin(Date.now() / 200);
            for (let Kl = 0; Kl < 2; Kl++) {
                let Ks = Math.cos(KB);
                let KZ = Math.sin(KB);
                NM.rotate(KB - Math.PI / 2);
                iC(Kx, [{
                    'x': 613,
                    'y': 377,
                    'w': 20,
                    'h': 44
                }], 1, KZ * 28, 44 / 2 + Ks * 28, 1, ![]);
                NM.rotate(-KB + Math.PI / 2);
                iC(Kx, [{
                    'x': 605,
                    'y': 424,
                    'w': 30,
                    'h': 58
                }], 1, 28 + Ks * 43 - 6, KZ * 43 + 58 / 2 - 6, 1, ![]);
                NM.scale(-1, 1);
            }
        },
        'brodyZroller': function(Kx) {
            NM.rotate(Math.round(Date.now() / Kx.dx) % 360 * Math.PI / 180);
            iC(Kx, [{
                'x': 644,
                'y': 318,
                'w': 66,
                'h': 66
            }], 1);
        }
    };
    function iV(Kx, Ky, KK, KO, Ku, KW=NM) {
        let KB = Math.cos(KK);
        let Kl = Math.sin(KK);
        KW.setTransform(KO * KB, -KO * Kl, Ku * Kl, Ku * KB, Kx, Ky);
    }
    function ij(Kx, Ky, KK, KO, Ku, KW=NM) {
        let KB = Math.cos(KK);
        let Kl = Math.sin(KK);
        KW.transform(KO * KB, -KO * Kl, Ku * Kl, Ku * KB, Kx, Ky);
    }
    function ic(Kx, Ky, KK, KO, Ku, KW, KB, Kl) {
        let Ks = Math.cos(KK);
        let KZ = Math.sin(KK);
        let Kp = Math.cos(KW);
        let Kh = Math.sin(KW);
        NM.setTransform(Kp * KO * Ks - Ku * Kh * KZ, -KO * Ks * Kh - Kp * Ku * KZ, Ku * Ks * Kh + Kp * KO * KZ, Kp * Ku * Ks - KO * Kh * KZ, KB + Kp * Kx + Kh * Ky, Kl - Kh * Kx + Kp * Ky);
    }
    function iq(Kx, Ky, KK, KO) {
        iC(Kx, [Ky], 1);
        let Ku = (1 + Math.sin(Date.now() / 70)) / 3;
        iC(Kx, [{
            'x': Ky.x,
            'y': Ky.y,
            'w': -KK,
            'h': Ky.h
        }], 1, -Ky.w / 2 - 10 * Ku, 0, 1, ![], null, 1 + Ku);
        ij(21, 6, Ku / 2, 1, 1);
        iC(Kx, [KO], 1, -10, 0, 1, ![], null, 1);
    }
    function ib(Kx, Ky, KK, KO=0, Ku=1) {
        NM.translate(Kx, Ky);
        let KW = Nc['./images/mobsmap.png'];
        let KB = (Math.sin(Date.now() / 2) * KK + KO) * Math.PI / 180;
        NM.scale(Ku, Ku);
        NM.rotate(KB);
        NM.drawImage(KW, 0, 850, 166, 94, -166, -94, 166, 94);
        NM.scale(1 / Ku, 1 / Ku);
        NM.rotate(-KB);
        NM.translate(-Kx, -Ky);
    }
    function iF(Kx, Ky, KK, KO=0, Ku=1, KW, KB=1) {
        NM.translate(Kx, Ky);
        let Kl = Nc['./images/mobsmap.png'];
        let Ks = (Math.sin(Date.now() / 140) * KK + KO) * Math.PI / 180;
        NM.scale(Ku * KB, Ku);
        NM.rotate(Ks);
        NM.drawImage(Kl, KW.x, KW.y, KW.w, KW.h, -KW.w, -KW.h, KW.w, KW.h);
        NM.rotate(-Ks);
        NM.scale(1 / Ku * KB, 1 / Ku);
        NM.translate(-Kx, -Ky);
    }
    function iU(Kx, Ky, KK, KO) {
        let Ku = Kx.dt;
        let KW = {
            'x': 156,
            'y': 482,
            'w': 64,
            'h': 48
        };
        KW.x = Ky;
        KW.y = KK;
        if (KO.ANIMATION_VALUE == null) {
            KO.ANIMATION_VALUE = -1;
            KO.ANIMATION_VELOCITY = 0;
        }
        if (Kx.dx !== 0 && Kx.dy == 0) {
            KO.ANIMATION_VELOCITY -= KO.ANIMATION_VALUE / 5 * Ku;
            KO.ANIMATION_VALUE += KO.ANIMATION_VELOCITY / 5 * Ku;
        } else if (Kx.dy < 0) {
            if (KO.ANIMATION_VALUE < 1) {
                KO.ANIMATION_VALUE -= 0.3 * Math.sign(KO.ANIMATION_VALUE - 1) * Ku;
            } else {
                KO.ANIMATION_VALUE = 1;
                KO.ANIMATION_VELOCITY = 0;
            }
        } else {
            let Ks = 0.2;
            if (Kx.dy != 0)
                Ks = 0.1;
            if (KO.ANIMATION_VALUE > -1) {
                KO.ANIMATION_VALUE -= Ks * Math.sign(KO.ANIMATION_VALUE + 1) * Ku;
            } else {
                KO.ANIMATION_VALUE = -1;
                KO.ANIMATION_VELOCITY = 0;
            }
        }
        let KB = x0(Math.sin(Date.now() / 80), -1, 1);
        let Kl = 30 * Math.abs(KB + 1) * Math.PI / 180;
        NM.scale(Kx.facing, 1);
        NM.translate(0, -4 * (KB + 1));
        iC(Kx, [{
            'x': KW.x,
            'y': KW.y,
            'w': 46,
            'h': 46
        }], 1, 0, 0, 1, ![]);
        NM.translate(-11, 14);
        NM.rotate(Kl);
        iC(Kx, [{
            'x': 204 - 156 + KW.x,
            'y': KW.y,
            'w': 18,
            'h': 22
        }], 1, 0, 5, 1, ![]);
        NM.rotate(-Kl);
        NM.translate(11 + 4, -14 + 12);
        NM.rotate(-15 * Math.abs(KB + 1) * Math.PI / 180);
        iC(Kx, [{
            'x': 205 - 156 + KW.x,
            'y': 506 - 482 + KW.y,
            'w': 12,
            'h': 16
        }], 1, 0, 8, 1, ![]);
    }
    function iC(Kx, Ky, KK, KO=0, Ku=0, KW=1, KB=!![], Kl, Ks=1, KZ=1) {
        if (KB)
            NM.scale(Kx.facing, 1);
        if (Kl)
            NM.scale(-1, 1);
        let Kp = Math.round(Date.now() / KK) % Ky.length;
        let Kh = Ky[Kp];
        NM.drawImage(Nc['./images/mobsmap.png'], Kh.x, Kh.y, Kh.w, Kh.h, Ks * KW * -Kh.w / 2 + KO, KZ * KW * -Kh.h / 2 + Ku, Kh.w * KW * Ks, Kh.h * KW * KZ);
    }
    function iz(Kx, Ky) {
        let KK = Nc['./images/mobsmap.png'];
        NM.rotate(Ky * Math.PI / 180);
        NM.drawImage(KK, Kx.x, Kx.y, Kx.w, Kx.h, -Kx.w / 2, -Kx.h / 2, Kx.w, Kx.h);
    }
    function iR(Kx, Ky, KK, KO, Ku, KW, KB) {
        let Kl = Nc['./images/mobsmap.png'];
        NM.scale(Kx.facing, 1);
        let Ks = Math.abs(Kx.dx);
        let KZ = (Ks - 6) / 30;
        if (KB.HEAD_ROTATION == null)
            KB.HEAD_ROTATION = 1;
        KB.HEAD_ROTATION -= Math.sign(KB.HEAD_ROTATION - KZ) * 0.02;
        if (Math.abs(KB.HEAD_ROTATION - KZ) < 0.03)
            KB.HEAD_ROTATION = KZ;
        let Kp = Ks / (6 * 245);
        let Kh = 25 * Math.sin(Date.now() * Kp) * Math.PI / 180;
        let Kg = -20 * Math.sin(Date.now() * Kp) + 10;
        let Kr = -Math.abs(9 * Math.cos(Date.now() * Kp));
        let KD = -25 * Math.sin(Date.now() * Kp) * Math.PI / 180;
        let KQ = 20 * Math.sin(Date.now() * Kp) + 10;
        let KM = -Math.abs(9 * Math.cos(Date.now() * Kp));
        NM.translate(55, 6);
        NM.drawImage(Kl, 0, 199, 37, 44, -30 + KQ, KM - 5, 37, 44);
        NM.translate(-30 + 25, -35);
        NM.rotate(KD);
        NM.drawImage(Kl, 0, 153, 55, 44, -25, 0, 55, 44);
        NM.rotate(-KD);
        NM.translate(-(-30 + 25), 35);
        NM.drawImage(Kl, 0, 199, 37, 44, -20 + Kg, Kr, 37, 44);
        NM.translate(-16 + 25, -30);
        NM.rotate(Kh);
        NM.drawImage(Kl, 0, 153, 55, 44, -25, 0, 55, 44);
        NM.rotate(-Kh);
        NM.translate(-(-16 + 25), 30);
        NM.drawImage(Kl, 0, 199, 37, 44, -140 - Kg + 10, Kr - 5, 37, 44);
        NM.translate(-155 + 25 + 10, -30);
        NM.rotate(-Kh);
        NM.drawImage(Kl, 0, 153, 55, 44, -25, 0 - 5, 55, 44);
        NM.rotate(Kh);
        NM.translate(-(-155 + 25 + 10), 30);
        NM.drawImage(Kl, 0, 199, 37, 44, -140 - KQ, KM, 37, 44);
        NM.translate(-155 + 25, -30);
        NM.rotate(-KD);
        NM.drawImage(Kl, 0, 153, 55, 44, -25, 0, 55, 44);
        NM.rotate(KD);
        NM.translate(-(-155 + 25), 30);
        NM.drawImage(Kl, Ku.x, Ku.y, Ku.w, Ku.h, -160, -160, Ku.w, Ku.h);
        NM.translate(20 + KB.HEAD_ROTATION * 30, -140 + KW.h / 3);
        NM.rotate(4 * Math.sin(Date.now() / 500) * Math.PI / 180 + KB.HEAD_ROTATION);
        NM.drawImage(Kl, KW.x, KW.y, KW.w, KW.h, 0, -KW.h / 3, KW.w, KW.h);
    }
    function im() {
        ib(0, 20, 15, 0, 1);
        ib(0, -20, 15, 150, 0.9);
    }
    function N0() {
        NM.lineCap = 'round';
        NM.lineWidth = 10;
        NM.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        let Kx = Date.now() / 1000;
        for (let Ky = 0; Ky < 10; Ky++) {
            let KK = (Kx + Ky * 9823.124) % (Math.PI * 2);
            NM.beginPath();
            NM.arc(0, 0, 50, KK, KK + Math.PI / 4);
            NM.stroke();
        }
    }
    const N1 = {
        'fly-wings': im,
        'aura': N0
    };
    const N2 = [15, 35, 70];
    const N3 = {
        'Swordsman': {
            'Lancer': {
                'Dragoon': {
                    'Jouster': {},
                    'Fang': {}
                },
                'Spear': {
                    'Spork': {}
                },
                'Puncher': {
                    'Slap Hand': {}
                }
            },
            'Sabre': {
                'Katana': {
                    'Excalibur': {},
                    'Death Sabre': {}
                },
                'Scythe': {
                    'Berserker': {}
                }
            },
            'Shield': {
                'Mirror': {
                    'Reflector': {},
                    'Chrome Orb': {}
                },
                'Umbrellar': {
                    'Storm Rider': {}
                }
            },
            'Paladin': {
                'Champion': {
                    'Holy Hammer': {},
                    'Slasher': {}
                },
                'Giant': {
                    'Behemoth': {}
                }
            }
        },
        'Archer': {
            'Marksman': {
                'Crossbower': {
                    'Sharpshooter': {}
                },
                'Winged Bow': {
                    'Pulse Bow': {}
                }
            },
            'Grenadier': {
                'Bomber': {
                    'Rocketeer': {},
                    'Dynamiter': {}
                },
                'Blunderbuss': {
                    'Cannon': {}
                },
                'Cake Cannon': {
                    'Cake Blaster': {}
                }
            },
            'Gunner': {
                'Sniper': {
                    'Railgun': {}
                },
                'Shotgun': {
                    'Boomstick': {}
                },
                'Pistol': {
                    'Gatling Gun': {}
                }
            },
            'Shurikenier': {
                'Boomeranger': {
                    'Solar Flare': {}
                },
                'Knife Thrower': {
                    'Assassin': {}
                }
            }
        },
        'Magician': {
            'Charge Blaster': {
                'Star Blaster': {
                    'Pulse Gun': {},
                    'Spanomancer': {},
                    'Meteor Staff': {}
                },
                'Alchemist': {
                    'Flower Mage': {}
                }
            },
            'Sorcerer': {
                'Fire Caster': {
                    'Infernal Mage': {},
                    'Flamethrower': {}
                },
                'Frost Staff': {
                    'Blizzard Staff': {},
                    'Whirlpooler': {}
                },
                'Spitter': {
                    'Fume Breather': {},
                    'Clipper': {}
                }
            },
            'Aura Shield': {
                'Aura Monk': {
                    'Aura Master': {}
                },
                'Rune Wizard': {
                    'Cyber Blaster': {}
                },
                'Zen Monk': {
                    'Orb Sage': {}
                },
                'Plasma Dagger': {
                    'Plasma Spear': {},
                    'Executor': {}
                }
            }
        }
    };
    const N4 = {};
    function N5(Kx, Ky=0) {
        for (const [KK,KO] of Object.entries(Kx)) {
            N4[KK] = Ky === 0 ? 0 : Ky - 1;
            N5(KO, Ky + 1);
        }
    }
    N5(N3);
    function N6(Kx, Ky, KK, KO, Ku, KW=![]) {
        const KB = G[Ky];
        if (KB == null)
            return;
        if (KW) {
            Kx.filter = 'brightness(0)';
        }
        Kx.drawImage(Nc['./images/itemmap.png'], 50 * (KB % 20), 50 * Math.floor(KB / 20), 50, 50, KK, KO, Ku, Ku);
        if (KW) {
            Kx.filter = 'none';
        }
    }
    const N7 = {
        'canvas': null,
        'ctx': null,
        'size': 0,
        'targetSize': 0,
        'rendering': ![],
        'renderedProgressRevision': -1,
        'setup': () => {
            N7.canvas = document.getElementById('weaponTree');
            N7.ctx = N7.canvas.getContext('2d');
            N7.canvas.setAttribute('aria-hidden', 'true');
        }
        ,
        'startRender': () => {
            const Kx = N7.targetSize > 0;
            if (Kx)
                N7.render();
            N7.canvas.classList.toggle('weapon-tree-visible', Kx);
            N7.canvas.setAttribute('aria-hidden', String(!Kx));
            N7.size = Kx ? 100 : 0;
            N7.rendering = ![];
        }
        ,
        'render': () => {
            const Kx = yk();
            if (N7.renderedProgressRevision === Kx)
                return;
            const Ky = N7.canvas;
            const KK = N7.ctx;
            KK.clearRect(0, 0, Ky.width, Ky.height);
            KK.translate(Ky.width / 2, Ky.height / 2);
            KK.strokeStyle = '#334440';
            N7.draw(N3, 2 * Math.PI, 0, 0, 100);
            KK.resetTransform();
            N7.renderedProgressRevision = Kx;
        }
        ,
        'draw': (Kx, Ky, KK, KO, Ku) => {
            let KW = N7.ctx;
            let KB = 1;
            if (typeof Kx == 'object') {
                KB = Object.keys(Kx).length;
            }
            let Kl = 1 / KB * Ky;
            let Ks = KK * Ku + Ku;
            let KZ = 0;
            for (let Kp in Kx) {
                N7.draw(Kx[Kp], Kl, KK + 1, KO + Kl * KZ, Ku);
                let Kh = (Ks - Ku / 2) * Math.cos(KO + Kl * KZ + Kl / 2);
                let Kg = (Ks - Ku / 2) * Math.sin(KO + Kl * KZ + Kl / 2);
                KW.beginPath();
                let Kr = Math.round(255 * (KO + Kl * KZ) / (2 * Math.PI));
                KW.fillStyle = 'rgb(' + Math.round(Kr / 2 + 76 / 2 + 40) + ', ' + (KK * 60 / 2 + 104 / 2 + 40) + ', ' + (KK * 60 / 2 + 98 / 2 + 40) + ')';
                KW.arc(0, 0, Ks, KO + Kl * KZ, KO + Kl * KZ + Kl);
                KW.lineTo(0, 0);
                KW.fill();
                KW.closePath();
                KW.stroke();
                KZ++;
                let KD = Ku / 100 * 50;
                N6(KW, Kp, Kh - KD / 2, Kg - KD / 2, KD, yc(Kp));
            }
        }
    };
    N7.setup();
    function N8() {
        if (Nq.settings.clouds) {
            NM.globalAlpha = 0.15;
            let Kx = Nc['./images/cloud.png'];
            for (let Ky in Nq.clouds) {
                let KK = Nq.clouds[Ky];
                Nq.clouds[Ky].x += KK.s / 3;
                if (KK.x > 1920)
                    Nq.clouds[Ky].x = -490;
                NM.translate(Math.round(KK.x), Math.round(KK.y));
                NM.scale(KK.sz, KK.sz);
                NM.drawImage(Kx, 0, 0);
                NM.resetTransform();
            }
            NM.globalAlpha = 1;
        }
    }
    function N9(Kx) {
        NM.fillStyle = '#f2e398';
        let Ky = Math.round(Math.sin(Nq.GAME_TICK / 2) * 8);
        NM.fillRect(-60 + Ky, 9, 20, 2);
        NM.fillRect(-55 - Ky, 0, 20, 2);
        NM.fillRect(-60 + Ky, -9, 20, 2);
    }
    function NI(Kx, Ky, KK, KO) {
        if (!Kx.focus)
            return;
        const Ku = Math.sin(Date.now() / 180);
        const KW = -KO - 40 + Ku * 7;
        const KB = 1 + Ku * 0.15;
        NM.save();
        NM.resetTransform();
        NM.translate(Ky.x, Ky.y);
        NM.scale(KK, KK);
        const Kl = Kx.focusType === 'tutorial' ? Nq.tutorial : null;
        const Ks = Date.now();
        if (Kl?.firstAttackAt != null && Ks - Kl.firstAttackAt >= 750) {
            const KZ = (Math.sin(Ks / 160) + 1) / 2;
            NM.globalAlpha = 0.12 + KZ * 0.13;
            NM.fillStyle = Kx.col ?? '#ffffff';
            NM.beginPath();
            NM.arc(0, 0, Kx.sz * (0.8 + KZ * 0.12), 0, Math.PI * 2);
            NM.fill();
        }
        NM.globalAlpha = 0.2 + 0.8 * (Math.sin(Ks / 200) + 1) / 2;
        if (Kx.focusType === 'controls1') {
            NM.drawImage(Nc['./images/tutorial/controls1.png'], -50, KW - 72 - 60, 100, 100);
        }
        NM.globalAlpha = 1;
        if (Kl?.movedAt != null && Ks - Kl.movedAt >= 3000) {
            const Kp = 'DEFEAT ME!';
            NM.font = 'bold 24px Quicksand';
            NM.textAlign = 'center';
            NM.lineWidth = 5;
            NM.strokeStyle = 'rgba(0, 0, 0, 0.65)';
            NM.fillStyle = 'white';
            NM.strokeText(Kp, 0, KW - 58);
            NM.fillText(Kp, 0, KW - 58);
            NM.textAlign = 'start';
        }
        NM.translate(0, KW);
        NM.scale(KB, KB);
        NM.fillStyle = '#d0d0d0';
        NM.strokeStyle = 'white';
        NM.lineWidth = 2;
        NM.beginPath();
        NM.moveTo(-13 * 1.5, -10);
        NM.lineTo(13 * 1.5, -10);
        NM.lineTo(0, 12);
        NM.closePath();
        NM.fill();
        NM.stroke();
        NM.restore();
    }
    function Na(Kx, Ky, KK) {
        const KO = document.createElement('canvas');
        KO.width = Kx.width;
        KO.height = Kx.height;
        const Ku = KO.getContext('2d');
        Ku.drawImage(Kx, 0, 0);
        const KW = new Image();
        KW.src = KO.toDataURL('image/png');
        KK[Ky] = KW;
    }
    function NG(Kx) {
        let Ky = xN(Kx.skin);
        if (Nc[Ky] == null) {
            Nc[Ky] = new Image();
            Nc[Ky].onerror = gameAssetImageError(gameAsset(Ky));
            Nc[Ky].src = gameAsset(Ky);
            Ky = './images/skins/blue.svg';
        }
        if (Kx.skin == 'debug') {
            NM.strokeStyle = 'red';
            let KO = Kx.sz;
            if (KO > 78)
                KO = 78;
            NM.strokeRect(-KO / 2, -KO / 2, KO, KO);
        }
        let KK = Nc[Ky].complete;
        if (!KK || Nc[Ky].naturalWidth === 0) {
            Ky = './images/skins/blue.svg';
        }
        if (Nq.skinImageCache[Ky] == null) {
            let Ku = Nc[Ky];
            let KW = document.createElement('canvas');
            KW.width = Ku.width;
            KW.height = Ku.height;
            let KB = KW.getContext('2d');
            KB.drawImage(Ku, 0, 0);
            Nq.skinImageCache[Ky] = KW;
        }
        return Nq.skinImageCache[Ky];
    }
    function Ni(Kx) {
        const Ky = './bgs/' + Kx + '.png';
        if (Nc[Ky] != null)
            return Nc[Ky];
        const KK = new Image();
        Nc[Ky] = KK;
        if (Kx === 'spires') {
            KK.onload = async () => {
                const KO = new OffscreenCanvas(KK.width,KK.height);
                const Ku = KO.getContext('2d');
                Ku.filter = 'hue-rotate(0deg) contrast(1.2)';
                Ku.drawImage(KK, 0, 0);
                Ku.globalCompositeOperation = 'multiply';
                Ku.globalAlpha = 0.2;
                Ku.fillStyle = 'rgba(190, 190, 190, 1)';
                Ku.fillRect(0, 0, KO.width, KO.height);
                Ku.globalAlpha = 1;
                Ku.globalCompositeOperation = 'destination-in';
                Ku.drawImage(KK, 0, 0);
                const KW = await KO.convertToBlob();
                const KB = new Image();
                const Kl = URL.createObjectURL(KW);
                KB.onload = () => {
                    Nc[Ky] = KB;
                    URL.revokeObjectURL(Kl);
                }
                ;
                KB.onerror = () => URL.revokeObjectURL(Kl);
                KB.src = Kl;
            }
            ;
        }
        if (Kx === 'spires')
            KK.crossOrigin = 'anonymous';
        KK.onerror = gameAssetImageError(gameAsset(Ky));
        KK.src = gameAsset(Ky);
        return KK;
    }
    function NN(Kx) {
        for (const Ky of T[Kx] ?? []) {
            Ni(Ky.id);
        }
    }
    function Nx(Kx) {
        if (Kx == null)
            return;
        NN(Kx);
        if (Kx == Nq.biome.current)
            return;
        Nq.biome.prev = Nq.biome.current;
        Nq.biome.current = Kx;
        let Ky = document.querySelector(':root');
        Ky.style.setProperty('--bgtop', o[Kx].bgtop);
        Ky.style.setProperty('--bgbottom', o[Kx].bgbottom);
        Nq.biome.change = Date.now();
        Nq.biome.current = Kx;
        Nq.biome.bg = o[Kx].bg;
        Nq.biome.cave = o[Kx].cave;
        if (o[Kx].fog == 'none') {
            Nq.biome.fog = 'none';
            return;
        }
        let KK = NM.createRadialGradient(Nw.width / 2, Nw.height / 2, 0, Nw.width / 2, Nw.height / 2, NQ.height / 2);
        KK.addColorStop(0, 'rgba(0, 0, 0, 0)');
        KK.addColorStop(0.7, o[Kx].fog);
        Nq.biome.fogRadius = o[Kx].fogRadius;
        Nq.biome.fog = Nq.biome.fogRadius == null ? KK : o[Kx].fog;
    }
    function Ny(Kx, Ky, KK, KO) {
        if (Nq.settings.details && ![]) {}
        return {
            'x': Math.round(-KK.x * KO) + Math.round(Kx * KO) + Math.round(NQ.width / 2),
            'y': Math.round(-KK.y * KO) + Math.round(Ky * KO) + Math.round(NQ.height / 2)
        };
    }
    function NK(Kx, Ky, KK, KO) {
        return {
            'x': (-KK.x + Kx) * KO + Math.round(NQ.width / 2),
            'y': (-KK.y + Ky) * KO + Math.round(NQ.height / 2)
        };
    }
    function NO(Kx, Ky, KK, KO) {
        return NK(Kx, Ky, KK, KO);
        return {
            'x': Math.round((-KK.x + Kx) * KO) + Math.round(NQ.width / 2),
            'y': Math.round((-KK.y + Ky) * KO) + Math.round(NQ.height / 2)
        };
    }
    function Nu(Kx, Ky, KK, KO, Ku=0) {
        const KW = Math.max(KO, 0.01);
        return Math.abs(Kx - KK.x) > NQ.width / (2 * KW) + Ku || Math.abs(Ky - KK.y) > NQ.height / (2 * KW) + Ku;
    }
    const NW = new Map();
    function NB(Kx, Ky) {
        const KK = Math.max(1, Math.round((1 + 2 * Kx) * Ky * 2) / 2);
        const KO = Kx + ':' + KK;
        let Ku = NW.get(KO);
        if (Ku != null)
            return Ku;
        const KW = 18;
        const KB = Math.ceil((KK + KW) * 2);
        Ku = document.createElement('canvas');
        Ku.width = KB;
        Ku.height = KB;
        const Kl = Ku.getContext('2d');
        const Ks = KB / 2;
        Kl.shadowColor = '#ebd6ff';
        Kl.shadowBlur = 15;
        Kl.fillStyle = 'rgb(250, ' + Math.round(235 - 10 * Math.sin(Kx)) + ', 255)';
        Kl.beginPath();
        Kl.arc(Ks, Ks, KK, 0, Math.PI * 2);
        Kl.fill();
        if (NW.size >= 48)
            NW.clear();
        NW.set(KO, Ku);
        return Ku;
    }
    function Nl(Kx, Ky, KK, KO) {
        if (!Nq.settings.background)
            return;
        if (!(Kx in T))
            return;
        for (let Ku in T[Kx]) {
            let KW = T[Kx][Ku];
            NM.globalAlpha = KW.a * KO;
            let KB = Ni(KW.id);
            if (!KB.complete || KB.naturalWidth === 0)
                continue;
            NM.drawImage(KB, Math.round(-Ky.x / KW.f % NQ.width), Math.round(KW.o * KK), NQ.width, Math.round(KB.height * KK));
            NM.drawImage(KB, Math.round(NQ.width + -Ky.x / KW.f % NQ.width), Math.round(KW.o * KK), NQ.width, Math.round(KB.height * KK));
        }
    }
    function Ns(Kx) {
        const Ky = NM.font;
        const KK = Kx.nameColor ?? 'white';
        const KO = Kx.nameColor != null ? ir(Kx.nameColor, 150) : '#222222';
        const Ku = Kx.name + '|' + KK + '|' + KO + '|' + Ky;
        if (Kx._nameCanvas && Kx._nameCanvasKey === Ku) {
            return Kx._nameCanvas;
        }
        const KW = NM.measureText(Kx.name);
        const KB = Math.ceil(KW.width);
        const Kl = 4;
        const Ks = new OffscreenCanvas(Math.max(1, KB + Kl * 2),40);
        const KZ = Ks.getContext('2d');
        const Kp = () => {
            KZ.clearRect(0, 0, Ks.width, Ks.height);
            KZ.font = Ky;
            KZ.textAlign = 'left';
            KZ.textBaseline = 'alphabetic';
            KZ.lineWidth = 3;
            KZ.lineJoin = 'miter';
            KZ.miterLimit = 2;
            KZ.fillStyle = KK;
            KZ.strokeStyle = KO;
            KZ.strokeText(Kx.name, Kl, 30);
            KZ.fillText(Kx.name, Kl, 30);
        }
        ;
        Kp();
        Ks.addEventListener('contextrestored', () => {
            Kp();
        }
        );
        Kx._nameCanvas = Ks;
        Kx._nameCanvasKey = Ku;
        Kx._cachedNameWidth = KB;
        return Ks;
    }
    function NZ() {
        if (!Nq.ready.map || !Nq.ready.files) {
            setTimeout( () => {
                requestAnimationFrame(NZ);
            }
            , 100);
            return;
        }
        NY.updates++;
        if (NY.updates % Math.round(NY.fps / 60) == 0)
            Nq.GAME_TICK++;
        NM.clearRect(0, 0, NQ.width, NQ.height);
        let Kx = Nq.updateData;
        let Ky = Nq.updatePlayerData;
        let KK = 1;
        if (NQ.width / 1920 > NQ.height / 1080) {
            KK = Math.round(NQ.width / 1920 * 1000) / 1000;
        } else {
            KK = Math.round(NQ.height / 1080 * 1000) / 1000;
        }
        Nq.scale = KK;
        let KO = 0;
        Nq.renderStart = Date.now();
        let Ku = {
            'x': Math.round(xI(Ky.player, !![], ![], Nq.renderStart)),
            'y': Math.round(xa(Ky.player, !![], ![], Nq.renderStart))
        };
        if ((!Nq.ingame || Nq.deathscreen) && Nq.camera.randomPan) {
            Ky.player.lastX = Ky.player.x;
            Ky.player.lastY = Ky.player.y;
            Ky.player.x = Math.round(Nq.camera.panX);
            Ky.player.y = Math.round(Nq.camera.panY);
            let KE = 2;
            Nq.camera.panX += KE * Math.cos(Nq.panDir * Math.PI / 180);
            Nq.camera.panY += KE * Math.sin(Nq.panDir * Math.PI / 180);
            if (Nq.camera.panX > Nq.mapwidth * Ia || Nq.camera.panX < 0) {
                Nq.panDir += 90;
            }
            if (Nq.camera.panY > Nq.mapheight * IG - 500 || Nq.camera.panY < 0) {
                Nq.panDir += 90;
            }
        } else {
            let Kv = Nq.camera.panTarget.x;
            let Ke = Nq.camera.panTarget.y;
            if (Nq.ingame) {
                Kv = Ku.x;
                Ke = Ku.y;
            }
            let KL = Kv - Nq.camera.panX;
            let KS = Ke - Nq.camera.panY;
            let KA = 0.06;
            let Kk = Nq.ingame;
            if (Kk || Nq.ingame && (Math.abs(KL) > NQ.width || Math.abs(KS) > NQ.height)) {
                Nq.camera.panX = Kv;
                Nq.camera.panY = Ke;
            } else {
                Nq.camera.panX += KL * KA;
                Nq.camera.panY += KS * KA;
            }
        }
        const KW = {
            'x': Nq.camera.panX,
            'y': Nq.camera.panY
        };
        if (Nq.prediction) {
            KW.x = j.getX();
            KW.y = j.getY();
        }
        let KB = 0 - KW.x + Math.round(NQ.width / 2);
        let Kl = 0 - KW.y + Math.round(NQ.height / 2);
        var Ks = 0;
        Kx.k = NX;
        NP.clearRect(0, 0, Nw.width, Nw.height);
        if (Nq.biome.fog != 'none') {
            NP.fillStyle = Nq.biome.fog;
            NP.fillRect(0, 0, Nw.width, Nw.height);
            if (Nq.biome.fogRadius != null)
                iw(0, 0, Nq.biome.fogRadius, [255, 0, 0, 0], {
                    'x': 0,
                    'y': 0
                });
        }
        NP.fillStyle = 'black';
        if (o[Nq.biome.current]?.area == 'ocean') {
            if (KW.y > Nq.mapSettings.waterDarknessStart) {
                let Ko = (KW.y - Nq.mapSettings.waterDarknessStart) / 1000;
                if (Ko > 1)
                    Ko = 1;
                let KT = (KW.y - Nq.mapSettings.waterDarknessStart) / (Nq.mapSettings.abyssStart - Nq.mapSettings.waterDarknessStart);
                KT = x0(KT, 0, 1);
                let KJ = 350 * (1 - KT) + 130 * KT;
                NP.globalAlpha = Ko;
                NP.fillRect(0, 0, Nw.width, Nw.height);
                NP.globalAlpha = 1;
                iw(0, 0, KJ, [255, 0, 0, 0], {
                    'x': 0,
                    'y': 0
                });
            }
        } else if (KW.y > Nq.mapSettings.caveStart && Nq.biome.cave !== 'no') {
            let Kd = (KW.y - Nq.mapSettings.caveStart) / 500;
            if (Kd > 1)
                Kd = 1;
            NP.globalAlpha = Kd;
            NP.fillRect(0, 0, Nw.width, Nw.height);
            NP.globalAlpha = 1;
            iw(0, 0, 350, [255, 0, 0, 0], {
                'x': 0,
                'y': 0
            });
        }
        for (let Kw in Nq.lights) {
            let KP = Nq.lights[Kw];
            if (Nu(KP.x, KP.y, KW, KK, (KP.rad ?? 0) + 50))
                continue;
            KP.rand = KP.x;
            iw(KP.x, KP.y, KP.rad, [KP.r, KP.g, KP.b, KP.l / 100], KW, KP);
        }
        let KZ = Nq.biome.current;
        if (o[KZ]?.base != null) {
            NM.fillStyle = o[KZ].base;
            NM.fillRect(0, 1080 - Math.round(350 / KK), NQ.width, Math.round(350 / KK));
        }
        if (Date.now() > Nq.biome.change + 1000) {
            Nl(KZ, KW, KK, 1);
        } else {
            let KH = -(Date.now() - Nq.biome.change) / 1000 + 1;
            Nl(Nq.biome.prev, KW, KK, KH);
            let Kt = (Date.now() - Nq.biome.change) / 1000;
            Nl(KZ, KW, KK, Kt);
            NM.globalAlpha = 1;
        }
        if (KW.y < Nq.mapSettings.caveStart)
            N8();
        NM.globalAlpha = 1;
        let Kp = {};
        for (let KV = -4 * KO; KV < 4 + 4 * KO; KV++) {
            for (let Kj = -3 * KO; Kj < 3 + 3 * KO; Kj++) {
                let Kc = KW.x - 1920 / 2 + 700 * KV;
                let Kq = KW.y - 1080 / 2 + 540 * Kj;
                if (Kc < 0)
                    Kc = 0;
                if (Kq < 0)
                    Kq = 0;
                if (Kc > Nq.mapwidth * 100)
                    Kc = Nq.mapwidth * 100 - 10;
                if (Kq > Nq.mapheight * 90)
                    Kq = Nq.mapheight * 90 - 10;
                let Kb = Math.floor(Kc / 700) * 700;
                let KF = Math.floor(Kq / (1080 / 2)) * (1080 / 2);
                let KU = KF * Math.ceil(Nq.mapwidth * 100 / 700) + Kb;
                Kp[KU] = {
                    'x': Kb,
                    'y': KF
                };
            }
        }
        const Kh = Nc.tiles.complete && Nc['./images/borders.png'].complete && Nc['./images/propsmap.png'].complete && Nc['./images/shadowmap.png'].complete;
        if (Kh && Nq.ready.map) {
            const KC = aa(Kp, KW);
            if (!KC) {
                for (let Kz in Kp) {
                    if (!IF(Kz)) {
                        IR(Kz, Id(Kp[Kz].x, Kp[Kz].y));
                        break;
                    }
                    Iz(Kz);
                }
                If(new Set(Object.keys(Kp)));
            }
        }
        for (let Kf in Kp) {
            let KR = Kp[Kf];
            if (Kf in KI) {
                let Km = Ny(KR.x, KR.y, KW, KK);
                let Kn = Ny(KR.x + 700, KR.y + 540, KW, KK);
                NM.drawImage(KI[Kf].back, Km.x, Km.y, Kn.x - Km.x, Kn.y - Km.y);
            }
        }
        if (0) {
            NM.strokeStyle = 'blue';
            NM.lineWidth = 3;
            let O0 = Ny(Math.floor(KW.x / 1000) * 1000, Math.floor(KW.y / 1000) * 1000, KW, KK);
            NM.strokeRect(O0.x, O0.y, Math.ceil(1000 * KK), Math.ceil(1000 * KK));
            let O1 = Ny(Math.floor(KW.x / 1000 - 1) * 1000, Math.floor(KW.y / 1000) * 1000, KW, KK);
            NM.strokeRect(O1.x, O1.y, Math.ceil(1000 * KK), Math.ceil(1000 * KK));
            let O2 = Ny(Math.floor(KW.x / 1000 + 1) * 1000, Math.floor(KW.y / 1000) * 1000, KW, KK);
            NM.strokeRect(O2.x, O2.y, Math.ceil(1000 * KK), Math.ceil(1000 * KK));
        }
        NM.globalAlpha = 0.65;
        for (let O3 = -9; O3 < 7; O3++) {
            let O4 = 30;
            let O5 = Math.floor(KW.x / 100);
            let O6 = Math.floor(KW.y / 90) * Nq.mapwidth + O3 * Nq.mapwidth + O5 - O4 / 2;
            if (O6 < 0)
                O6 = 0;
            let O7 = O6 + O4;
            if (O7 > Nq.map.length)
                O7 = Nq.map.length;
            for (let O8 = O6; O8 < O7; O8++) {
                if (!Nq.map[O8].liquid)
                    Nq.map[O8].draw(KB, Kl, KW, KK);
            }
        }
        NM.globalAlpha = 1;
        let Kg = Math.floor(KW.y / 90 + 1) * Nq.mapwidth + Math.floor(KW.x / 100);
        if (Kg < 0)
            Kg = 0;
        let Kr = Nq.map[Kg]?.type;
        let KD = Kr ? Nq.tileIndex[Kr].biome : null;
        if (KD && KD in o && Nq.tileIndex[Kr].wall !== !![])
            Nx(KD);
        const KQ = 'bold 20px Quicksand';
        if (NM.font !== KQ)
            NM.font = KQ;
        if (xU) {
            let O9 = Math.floor(KW.y / 90) * Nq.mapwidth + Math.floor(KW.x / 100);
            let OI = y3.a || y3.d || y3.w;
            if (!OI && (xF[O9].x != 0 || xF[O9].y != 0)) {} else {
                xF[O9] = {
                    'x': y3.a * -1 + y3.d * 1,
                    'y': y3.w * -1
                };
            }
            if (y3.s) {
                xF[O9] = {
                    'x': 0,
                    'y': 0
                };
            }
        }
        if (xF.length > 0) {
            for (let Oa in xF) {
                let OG = Oa % Nq.mapwidth * 100 + KB + 50;
                let Oi = Math.floor(Oa / Nq.mapwidth) * 90 + Kl + 45;
                NM.fillStyle = 'red';
                NM.strokeStyle = 'red';
                NM.lineWidth = 2;
                NM.beginPath();
                NM.moveTo(OG, Oi);
                NM.lineTo(OG + xF[Oa].x * 30, Oi + xF[Oa].y * 30);
                NM.stroke();
            }
        }
        if (Nq.ingame && Nq.players[Ky.player.id] != null) {
            let ON = Nq.players[Ky.player.id].hp;
            if (ON < 25) {
                let Ox = -ON / 25 + 1;
                NP.globalAlpha = Ox;
                NP.fillStyle = KN;
                NP.fillRect(0, 0, Nw.width, Nw.height);
                NP.globalAlpha = 1;
            }
        }
        if (Nq.prediction) {
            let Oy = Math.round(xI(Ky.player, !![], ![], Nq.renderStart));
            let OK = Math.round(xa(Ky.player, !![], ![], Nq.renderStart));
            NM.lineWidth = 2;
            let OO = Ny(Oy, OK, KW, KK);
            NM.strokeStyle = 'blue';
            NM.beginPath();
            NM.arc(OO.x, OO.y, 58 / 2 * KK, 0, Math.PI * 2);
            NM.stroke();
            let Ou = Ny((j.x + Oy) / 2, (j.y + OK) / 2, KW, KK);
            NM.strokeStyle = 'green';
            NM.beginPath();
            NM.arc(Ou.x, Ou.y, 58 / 2 * KK, 0, Math.PI * 2);
            NM.stroke();
            NM.strokeStyle = 'red';
            NM.lineWidth = 2;
            NM.beginPath();
            NM.arc(j.x + KB, j.y + Kl, 58 / 2 * KK, 0, Math.PI * 2);
            NM.stroke();
        }
        for (const OW in Nq.mobs) {
            let OB = Nq.mobs[OW];
            if (OB.hide)
                continue;
            let Ol = xI(OB, ![], ![], Nq.renderStart);
            let Os = xa(OB, ![], ![], Nq.renderStart);
            let OZ = Nq.mobData[OB.id];
            const Op = Math.max(OZ?.width ?? 0, OZ?.height ?? 0, OZ?.size ?? OB.sz, OB.sz) + 150;
            if (Nu(Ol, Os, KW, KK, Op))
                continue;
            let Oh = NO(Ol, Os, KW, KK);
            NM.translate(Oh.x, Oh.y);
            NM.scale(KK, KK);
            ix({
                'x': 0,
                'y': -(OZ.height - OZ.size / 2),
                'sz': OB.sz,
                'type': OB.type,
                'col': OB.col,
                'facing': OB.facing,
                'hp': OB.hp
            }, 0, 0);
            let Og = 0;
            let Or = NY.fps;
            if (Or < 30)
                Or = 30;
            Og = 60 / Or;
            id(Ol, Os, OB.sz / 2);
            it[OB.type]({
                'x': 0,
                'id': OW,
                'y': 0,
                'rotation': xi(OB),
                'sz': OB.sz,
                'type': OB.type,
                'col': OB.col,
                'facing': OB.facing,
                'hp': OB.hp,
                'dx': OB.x - OB.lastServerX,
                'dy': OB.y - OB.lastServerY,
                'xi': Ol,
                'yi': Os,
                'dt': Og
            }, KB, Kl, KW, KK, OB, OZ, Oh);
            NM.resetTransform();
            const OD = (OZ.height ?? OZ.size) - OZ.size / 2;
            NI(OB, Oh, KK, OD);
            if (Nq.DEBUG) {
                let OQ = NO(Ol, Os, KW, KK);
                NM.translate(OQ.x, OQ.y);
                NM.scale(KK, KK);
                if (OZ.polygon) {
                    NM.scale(OB.facing, 1);
                    let OM = OZ.geometry;
                    NM.fillStyle = 'red';
                    NM.strokeStyle = 'red';
                    for (let OY in OM)
                        NM.fillRect(OM[OY].x, OM[OY].y, 4, 4);
                    if (OM.length > 1) {
                        NM.beginPath();
                        NM.moveTo(OM[0].x, OM[0].y);
                        for (let OX = 1; OX < OM.length; OX++)
                            NM.lineTo(OM[OX].x, OM[OX].y);
                        NM.lineTo(OM[0].x, OM[0].y);
                        NM.stroke();
                    }
                }
                NM.resetTransform();
            }
            if (Nq.DEBUG) {
                NM.strokeStyle = 'red';
                NM.beginPath();
                NM.arc(Oh.x, Oh.y, KK * (OZ.hitSize ?? OZ.size) / 2, 0, Math.PI * 2);
                NM.stroke();
            }
        }
        for (const OE in Nq.players) {
            let Ov = Nq.players[OE];
            if (!Ov.npc)
                Ks++;
            if (Ov.hide)
                continue;
            let Oe = xI(Ov, !![], ![], Nq.renderStart);
            let OL = xa(Ov, !![], ![], Nq.renderStart);
            if (Nu(Oe, OL, KW, KK, Math.max(400, Ov.sz * 2)))
                continue;
            let OS = NO(Oe, OL, KW, KK);
            NM.translate(OS.x, OS.y);
            NM.scale(Ov.facing * KK, KK);
            if (Ov.mob != null) {
                let Od = Nq.mobData[Ov.mob];
                it[Od.renderId]({
                    'x': 0,
                    'y': 0,
                    'rotation': 0,
                    'sz': Od.size,
                    'type': Od.renderId,
                    'col': Od.color,
                    'facing': 1,
                    'hp': Ov.hp,
                    'dx': Ov.x - Ov.lastServerX,
                    'dy': Ov.y - Ov.lastServerY,
                    'xi': Oe,
                    'yi': OL
                }, KB, Kl, KW, KK, Ov);
                NM.resetTransform();
                NI(Ov, OS, KK, Ov.sz / 2);
                continue;
            }
            if (Ov.prop != null) {
                let Ow = Il[Ov.prop];
                let OP = Ow[7] ?? './images/propsmap.png';
                NM.drawImage(Nc[OP], Ow[0], Ow[1], Ow[2], Ow[3], -Ow[2] / 2, -Ow[3] / 1 + Ov.sz / 2 + 10, Ow[2], Ow[3]);
                NM.resetTransform();
                NI(Ov, OS, KK, Ow[3] - Ov.sz / 2);
                continue;
            }
            if (Ov.i)
                NM.globalAlpha = 0.5;
            if (Ov.dashing)
                N9();
            if (Ov.a) {
                NM.rotate(-90 * Math.PI / 180);
                N9();
                NM.resetTransform();
                NM.translate(OS.x, OS.y);
                NM.scale(Ov.facing * KK, KK);
            }
            if (Ov.skin === 'present mimic') {
                let OH = Nq.mobData[101];
                it[OH.renderId]({
                    'x': 0,
                    'y': 0,
                    'rotation': 0,
                    'id': OH.id,
                    'sz': OH.size,
                    'type': OH.renderId,
                    'col': OH.color,
                    'facing': 1,
                    'hp': Ov.hp,
                    'dx': Ov.x - Ov.lastServerX,
                    'dy': Ov.y - Ov.lastServerY,
                    'xi': Oe,
                    'yi': OL
                }, KB, Kl, KW, KK, Ov, OH);
                NM.resetTransform();
                NM.translate(OS.x, OS.y);
                NM.scale(Ov.facing * KK, KK);
            }
            if (Ov.skin === 'molten' || Ov.skin == 'lava') {
                iw(Oe, OL, 40, [255, 100, 0, 0.4], KW);
            }
            if (Ov.skin === '62dead') {
                iw(Oe, OL, 40, [0, 130, 255, 0.4], KW);
            }
            if (Ov.skin === 'thelazor') {
                iw(Oe, OL, 100, [255, 0, 0, 0.4], KW);
            }
            if (Ov.skin === 'batdevil') {
                iw(Oe, OL, 120, [255, 81, 255, 0.8], KW);
            }
            if (Ov.skin === 'superstar') {
                iw(Oe, OL, 100, [255, 81, 255, 0.4], KW);
            }
            if (Ov.skin === 'green wraith') {
                iw(Oe, OL, 100, [0, 255, 0, 0.4], KW);
            }
            if (Ov.skin === 'night bandit') {
                iw(Oe, OL, 100, [255, 0, 255, 0.4], KW);
            }
            if (Ov.skin === 'demon eyes') {
                iw(Oe, OL, 100, [255, 0, 0, 0.4], KW);
            }
            if (Ov.skin === 'neon raider') {
                iw(Oe, OL, 100, [0, 255, 255, 0.4], KW);
            }
            if (Ov.skin === 'mewing martin') {
                iw(Oe, OL, 100, [255, 30, 0, 0.4], KW);
            }
            if (Ov.skin == 'energy core') {
                iw(Oe, OL, 250, [0, 255, 255, 0.4], KW);
            }
            if (Ov.skin == 'dark matter' || Ov.skin == 'purple spiritual oxen') {
                iw(Oe, OL, 80, [255, 50, 220, 0.4], KW);
            }
            if (Ov.skin === 'frost lava' || Ov.skin == 'orb' || Ov.skin == 'chronoprometheus') {
                iw(Oe, OL, 40, [0, 100, 255, 0.4], KW);
            }
            if (Ov.skin == 'erthium eye') {
                iw(Oe, OL, 250, [222, 146, 222, 0.4], KW);
            }
            if (Ov.skin == 'biome bee' || Ov.skin == 'snow globe') {
                NM.fillStyle = o[KZ]?.color ?? 'white';
                NM.beginPath();
                NM.arc(0, 0, Ov.sz / 2 - 1, 0, Math.PI * 2);
                NM.fill();
            }
            if (Ov.skin == 'biome egg') {
                NM.fillStyle = o[KZ]?.color ?? 'white';
                NM.beginPath();
                NM.ellipse(0, -7, Ov.sz * 0.45, Ov.sz * 0.55, 0, 0, Math.PI * 2);
                NM.fill();
            }
            if (Ov.skin == 'submarine') {
                let Ot = Math.max((KW.y - Nq.mapSettings.caveStart) / 4000, (Ov.y - Nq.mapSettings.caveStart) / 4000);
                if (Ot > 1)
                    Ot = 1;
                if (Ot > 0)
                    iw(Oe, OL, 95 + 65 * Ot, [255, 221, 21, 0.5 * Ot], KW);
            }
            if (Ov.skin == 'angler guard') {
                let OV = Math.max((KW.y - Nq.mapSettings.caveStart) / 4000, (Ov.y - Nq.mapSettings.caveStart) / 4000);
                if (OV > 1)
                    OV = 1;
                if (OV > 0)
                    iw(Oe, OL, 50 + 40 * OV, [255, 100, 0, 0.6 * OV], KW);
            }
            if (Ov.skin == 'ghost submarine') {
                let Oj = Math.max((KW.y - Nq.mapSettings.caveStart) / 4000, (Ov.y - Nq.mapSettings.caveStart) / 4000);
                if (Oj > 1)
                    Oj = 1;
                if (Oj > 0)
                    iw(Oe, OL, 95 + 65 * Oj, [193, 252, 175, 0.5 * Oj], KW);
            }
            let OA = NG(Ov);
            id(Oe, OL, Ov.sz / 2, Ov.facing);
            if (!OA || OA.height == 0 || OA.width == 0) {
                let Oc = Ov.handColor ?? '#6D9EEB';
                NM.fillStyle = Oc;
                NM.beginPath();
                NM.arc(0, 0, Ov.sz / 2, 0, Math.PI * 2);
                NM.fill();
            } else {
                NM.drawImage(OA, -OA.width / 200 * Ov.sz, -OA.height / 100 * Ov.sz + Ov.sz / 2, OA.width / 100 * Ov.sz, OA.height / 100 * Ov.sz);
            }
            if (Ov.skin == 'divinus numen' || Ov.skin == 'divinus numen legionnaire' || Ov.skin == 'divinus numen scorpia' || Ov.skin == 'divinus numen neonia' || Ov.skin == 'divinus numen draconia' || Ov.skin == 'divinus numen celestia') {
                let Oq = 2 * (Date.now() % 9000 / 9000);
                if (Ov.skin === 'divinus numen celestia') {
                    iw(Oe, OL, 200, [0, 0, 0, 0], KW);
                    if (Oq <= 1) {
                        iw(Oe, OL, Oq * 200, [150, 255, 255, 0.6 * (1 - Oq ** 4)], KW);
                        if (Oq > 0.2)
                            iw(Oe, OL, Oq * 200 - 37.5, [255, 255, 100, 0.5 * (1 - Oq ** 4)], KW);
                    } else {
                        iw(Oe, OL, (1 - 2 * Math.abs(1.5 - Oq)) * 275, [255, 255, 100, 0.5 * (1 - 2 * Math.abs(1.5 - Oq))], KW);
                    }
                } else if (Ov.skin !== 'divinus numen') {
                    iw(Oe, OL, 150, [0, 0, 0, 0], KW);
                    if (Oq <= 1) {
                        iw(Oe, OL, Oq * 150, [150, 255, 255, 0.6 * (1 - Oq ** 4)], KW);
                        if (Oq > 0.2)
                            iw(Oe, OL, Oq * 150 - 30, [255, 255, 100, 0.5 * (1 - Oq ** 4)], KW);
                    } else {
                        iw(Oe, OL, (1 - 2 * Math.abs(1.5 - Oq)) * 175, [255, 255, 100, 0.5 * (1 - 2 * Math.abs(1.5 - Oq))], KW);
                    }
                }
                let Ob = Ov.sz;
                let OF = [];
                if (Ov.skin == 'divinus numen celestia') {
                    let u2 = 0;
                    const u3 = (Ov.name || '') + (Ov.team || '');
                    for (let u9 = 0; u9 < u3.length; u9++)
                        u2 = (u2 << 5) - u2 + u3.charCodeAt(u9);
                    u2 = Math.abs(Math.abs(u2) * 2654435761 >>> 0 ^ Math.abs(u2) * 2246822519 >>> 0);
                    u2 = (u2 >>> 16 ^ u2) * 2146121005;
                    const u4 = Math.abs(u2 >>> 15 ^ u2);
                    const u5 = Math.floor(Math.log(Ov.lvl + 1) / Math.log(100) * 12);
                    const u6 = [0, 0, 0, 0, 0, 0];
                    for (let uI = 0; uI < u5; uI++) {
                        for (let ua = 0; ua < 100; ua++) {
                            let uG = u4 ^ (uI * 10 + ua) * 2654435761;
                            uG = uG * 2246822519 >>> 0;
                            const ui = Math.abs(uG >>> 16 ^ uG) % 6;
                            if (u6[ui] < 3) {
                                u6[ui]++;
                                break;
                            }
                        }
                    }
                    const u7 = [1, 5, 4, 3];
                    const u8 = Date.now() * 0.0002;
                    for (let uN = 0; uN < 6; uN++) {
                        const ux = u8 * 2 * Math.PI + uN / 6 * 2 * Math.PI;
                        OF.push({
                            'x': Math.sin(ux) * Ob * 0.55,
                            'y': -Ob * 0.9,
                            'sz': Ob * 0.07,
                            'cos': Math.cos(ux),
                            'type': u7[u6[uN]]
                        });
                    }
                    for (let uy of OF) {
                        if (uy.cos < 0) {
                            if (uy.type === 5) {
                                const uK = Nc['./images/skins/divinus numen celestia gear.png'];
                                if (uK && uK.complete)
                                    NM.drawImage(uK, uy.x - uy.sz * 1.5, uy.y - uy.sz * 1.5, uy.sz * 3, uy.sz * 3);
                            } else {
                                NM.fillStyle = uy.type === 3 ? '#badaff' : uy.type === 4 ? '#fde99b' : '#7a6862';
                                NM.beginPath();
                                NM.arc(uy.x, uy.y, uy.sz, 0, Math.PI * 2);
                                NM.fill();
                                NM.strokeStyle = uy.type === 3 ? '#fdfdfd' : uy.type === 4 ? '#fdf6da' : '#61534eff';
                                NM.lineWidth = uy.sz * 0.3;
                                NM.stroke();
                            }
                        }
                    }
                }
                const OU = Ob * 0.04
                  , OC = Date.now() * 0.005
                  , Oz = []
                  , Of = [];
                let OR = -OA.width / 200 * Ob + 128.5 / 240 * (OA.width / 100 * Ob);
                let Om = -OA.height / 100 * Ob + Ob / 2 + 60 / 175 * (OA.height / 100 * Ob);
                let On = 85 * Math.PI / 180;
                let u0;
                if (Ov.skin == 'divinus numen') {
                    u0 = 9;
                } else if (Ov.skin == 'divinus numen celestia') {
                    u0 = 18;
                } else {
                    u0 = 16;
                }
                Oz.push({
                    'x': OR,
                    'y': Om
                });
                for (let uO = 0; uO < u0; uO++) {
                    OR += Math.cos(On) * OU;
                    Om -= Math.sin(On) * OU;
                    Oz.push({
                        'x': OR,
                        'y': Om
                    });
                    Of.push(On);
                    On += (0.2 + uO / 5) * Math.PI / 180;
                }
                const u1 = uu => Math.sin(uu * 0.5) * Math.cos(uu * 1.3) * Math.sin(uu * 0.7);
                NM.fillStyle = '#fdf6da';
                for (let uu = 0; uu < Oz.length - 2; uu += 2) {
                    const uW = Oz[uu]
                      , uB = Oz[uu + 1]
                      , ul = Oz[uu + 2];
                    const us = -Math.sin(Of[uu]);
                    const uZ = -Math.cos(Of[uu]);
                    const up = (uW.x + ul.x) / 2
                      , uh = (uW.y + ul.y) / 2;
                    const ug = uu * 0.5
                      , ur = Math.max(0, u1(OC + ug) * 0.3 + 0.35);
                    if (ur > 0.2) {
                        const uD = OU * 16 * ur;
                        const uQ = up + us * uD
                          , uM = uh + uZ * uD;
                        const uY = Math.cos(OC * 2 + ug * 5) * uD * 0.4;
                        const uX = Math.sin(OC * 2 + ug * 5) * uD * 0.4;
                        NM.beginPath();
                        NM.moveTo(up, uh);
                        NM.quadraticCurveTo(uQ + uY * 0.5, uM + uX * 0.5, uQ + uY, uM + uX);
                        NM.quadraticCurveTo(up + uY * 0.6, uh + uX * 0.6, up, uh);
                        NM.fill();
                    }
                }
                NM.drawImage(OA, -OA.width / 200 * Ob, -OA.height / 100 * Ob + Ob / 2, OA.width / 100 * Ob, OA.height / 100 * Ob);
                NM.strokeStyle = '#fdf6da';
                NM.lineWidth = Ob / 10;
                NM.lineCap = 'round';
                NM.lineJoin = 'round';
                NM.beginPath();
                NM.moveTo(Oz[0].x, Oz[0].y);
                for (let uE = 1; uE < Oz.length; uE++)
                    NM.lineTo(Oz[uE].x, Oz[uE].y);
                NM.stroke();
                for (let uv = 0; uv < Oz.length - 2; uv += 2) {
                    const ue = Oz[uv]
                      , uL = Oz[uv + 2];
                    const uS = Math.cos(Of[uv])
                      , uA = -Math.sin(Of[uv]);
                    const uk = -Math.sin(Of[uv])
                      , uo = -Math.cos(Of[uv]);
                    const uT = -uk
                      , uJ = -uo;
                    const ud = uv * 0.5
                      , uw = Math.max(0, u1(OC + ud) * 0.4 + 0.7);
                    if (uw > 0.2) {
                        const uP = (Math.sin(OC + ud * 2) + 1) * 0.5;
                        const uH = uS * (1 - uP) + (uS + uT) * 0.707 * uP;
                        const ut = uA * (1 - uP) + (uA + uJ) * 0.707 * uP;
                        const uV = OU * 7 * uw;
                        const uj = ue.x + (uL.x - ue.x) * 0.5 + uH * uV;
                        const uc = ue.y + (uL.y - ue.y) * 0.5 + ut * uV;
                        const uq = OU * 0.5
                          , ub = OU * 0.8;
                        const uF = ue.x - uS * uq + uT * ub
                          , uU = ue.y - uA * uq + uJ * ub;
                        const uC = uL.x + uS * uq - uT * ub
                          , uz = uL.y + uA * uq - uJ * ub;
                        NM.fillStyle = '#fdf6da';
                        NM.beginPath();
                        NM.moveTo(uF, uU);
                        NM.lineTo(uC, uz);
                        NM.lineTo(uj, uc);
                        NM.fill();
                    }
                }
                if (Ov.skin == 'divinus numen celestia') {
                    for (let uf of OF) {
                        if (uf.cos >= 0) {
                            if (uf.type === 5) {
                                const uR = Nc['./images/skins/divinus numen celestia gear.png'];
                                if (uR && uR.complete)
                                    NM.drawImage(uR, uf.x - uf.sz * 1.5, uf.y - uf.sz * 1.5, uf.sz * 3, uf.sz * 3);
                            } else {
                                NM.fillStyle = uf.type === 3 ? '#badaff' : uf.type === 4 ? '#fde99b' : '#7a6862';
                                NM.beginPath();
                                NM.arc(uf.x, uf.y, uf.sz, 0, Math.PI * 2);
                                NM.fill();
                                NM.strokeStyle = uf.type === 3 ? '#fdfdfd' : uf.type === 4 ? '#fdf6da' : '#61534eff';
                                NM.lineWidth = uf.sz * 0.3;
                                NM.stroke();
                            }
                        }
                    }
                }
            }
            NM.globalAlpha = 1;
            NM.scale(Ov.facing, 1);
            let Ok = Ov.y - Ov.lastServerY;
            if (Math.sign(Ok) == 1) {
                Ov.handY -= Math.abs(20 - Ov.handY) / 40;
            }
            if (Math.sign(Ok) == -1) {
                Ov.handY += Math.abs(-10 - Ov.handY) / 40;
            }
            if (Ok == 0) {
                Ov.handY -= Math.abs(0 - Ov.handY) / 20 * Math.sign(Ov.handY);
            }
            Ov.handY = x0(Ov.handY, -20, 10);
            let Oo = Ns(Ov);
            let OT = Ov._cachedNameWidth + Ov.icons.length * 35;
            let OJ = Ov.hp != 100 ? -12 : 0;
            if (!Ov.i) {
                if (Ov.weapon.type in au) {
                    au[Ov.weapon.type]({
                        'x': Oe,
                        'y': OL,
                        'facing': Ov.facing,
                        'sz': Ov.sz,
                        'weapon': Ov.weapon,
                        'handY': Ov.handY,
                        'handColor': Ov.handColor,
                        'renderHands': Ov.renderHands
                    }, 0, 0, {
                        'x': xI(Ov.weapon),
                        'y': xa(Ov.weapon),
                        'e': Ov.weapon.e,
                        'color': Ov.weapon.color,
                        'facing': Ov.weapon.facing,
                        'type': Ov.weapon.type,
                        'u': Ov.weapon.u,
                        'angle': xi(Ov.weapon)
                    }, KW, KK, Ov);
                    NM.resetTransform();
                    NM.translate(OS.x, OS.y);
                    NM.scale(KK, KK);
                }
                if (Nq.settings.names) {
                    const um = -(OT / 2);
                    const un = -Ov.sz / 2 - 15 + OJ;
                    NM.drawImage(Oo, um - 4, un - 30);
                    for (let W0 = 0; W0 < Ov.icons.length; W0++) {
                        NM.drawImage(Nc['./images/icons/' + Ov.icons[W0] + '.png'], OT / 2 + 5 - Ov.icons.length * 35 + W0 * 35, un - 23, 30, 30);
                    }
                }
            }
            ix({
                'x': 0,
                'y': 0,
                'sz': Ov.sz,
                'hp': Ov.hp
            }, 0, 0 - 10);
            if (Ov.dev || Ov.dataTag != null) {
                let W1 = NM.measureText(Ov.dataTag ?? 'developer').width;
                let W2 = -Ov.sz - 30;
                NM.fillStyle = 'blue';
                NM.fillRect(-W1 / 2, -16 + W2, W1, 24);
                NM.fillStyle = 'yellow';
                let W3 = Ov.dataTag ?? 'developer';
                NM.fillText(W3, -W1 / 2, W2);
                NM.resetTransform();
            }
            NM.resetTransform();
            NI(Ov, OS, KK, Ov.sz / 2);
            if (Ov.debug != null) {
                NM.fillStyle = 'rgba(0, 0, 0, 0)';
                NM.strokeStyle = 'red';
                let W4 = [];
                for (let W5 in Ov.debug) {
                    let W6 = Ov.debug[W5];
                    W4.push({
                        'x': W6.x + KB,
                        'y': W6.y + Kl
                    });
                }
                ii(W4);
            }
        }
        for (let W7 in Nq.projectiles) {
            let W8 = Nq.projectiles[W7];
            if (Nu(W8.x, W8.y, KW, KK, Math.max(250, W8.r ?? 0)))
                continue;
            iK(xH(W8), KW, KK);
        }
        NM.shadowColor = 'transparent';
        for (let W9 in Kp) {
            let WI = Kp[W9];
            if (W9 in KI) {
                let Wa = Ny(WI.x, WI.y, KW, KK);
                let WG = Ny(WI.x + 700, WI.y + 540, KW, KK);
                NM.drawImage(KI[W9].front, Wa.x, Wa.y, WG.x - Wa.x, WG.y - Wa.y);
            }
        }
        for (const Wi in Nq.mobs) {
            let WN = Nq.mobs[Wi];
            if (WN.hide)
                continue;
            if (Math.abs(WN.x - (Nq.mouseX + KW.x)) < WN.sz / 2 && Math.abs(WN.y - (Nq.mouseY + KW.y)) < WN.sz / 2 + 10) {
                let Wx = NO(xI(WN, ![], ![], Nq.renderStart), xa(WN, ![], ![], Nq.renderStart), KW, KK);
                NM.translate(Wx.x, Wx.y);
                NM.scale(KK, KK);
                NM.fillStyle = 'white';
                NM.strokeStyle = 'black';
                NM.lineWidth = 2;
                let Wy = Nq.mobData[WN.id];
                const WK = WN.maxHp ?? Wy.hp;
                let WO = Wy.name + ' ' + Math.round(WN.hp / 100 * WK) + '/' + WK;
                let Wu = NM.measureText(WO).width;
                NM.strokeText(WO, -Wu / 2, WN.sz / 2 + 25);
                NM.fillText(WO, -Wu / 2, WN.sz / 2 + 25);
            }
            NM.resetTransform();
        }
        for (let WW in Nq.players) {
            let WB = Nq.players[WW];
            if (WB.hide)
                continue;
            if (!Nq.settings.chat)
                break;
            let Wl = xI(WB, !![]);
            let Ws = xa(WB, !![]);
            if (WW == Ky.player.id) {
                Wl = KW.x;
                Ws = KW.y;
            }
            let WZ = WB.hp != 100 ? -12 : 0;
            let Wp = WB.msg;
            if (WB.msg != '') {
                let Wh = NM.measureText(WB.msg).width;
                NM.fillStyle = 'rgba(0, 0, 0, 0.5)';
                let Wg = Ny(Wl, Ws, KW, KK);
                let Wr = Wg.x;
                let WD = Wg.y;
                NM.fillRect(Wr - Wh / 2, -WB.sz / 2 - Math.round(62 * KK) + WD + WZ, Wh, Math.round(24 * KK));
                NM.fillStyle = 'white';
                NM.fillText(WB.msg, Wr - Wh / 2, WD - WB.sz / 2 - Math.round(45 * KK) + WZ);
            }
        }
        for (let WQ in Nq.items) {
            let WM = Nq.items[WQ];
            let WY = Math.abs(WM.x - (Nq.mouseX + KW.x)) < 25 && Math.abs(WM.y - (Nq.mouseY + KW.y)) < 25;
            let WX = xI(WM, ![], ![], Nq.renderStart, j.lastTick);
            let WE = xa(WM, ![], ![], Nq.renderStart, j.lastTick);
            if (Nu(WX, WE, KW, KK, 60))
                continue;
            iy(WX, WE, WM, KW, KK, WY);
        }
        for (let Wv = 0; Wv < Kx.xp.length; Wv++) {
            const We = Kx.xp[Wv];
            const WL = 1 + 2 * We.sz;
            if (Nu(We.x, We.y, KW, KK, WL + 18))
                continue;
            const WS = Math.round((We.x - KW.x) * KK) + NQ.width / 2;
            const WA = Math.round((We.y - KW.y) * KK) + NQ.height / 2;
            const Wk = NB(We.sz, KK);
            NM.drawImage(Wk, WS - Wk.width / 2, WA - Wk.height / 2);
        }
        for (let Wo = -9; Wo < 7; Wo++) {
            let WT = 30;
            let WJ = Math.floor(KW.x / 100);
            let Wd = Math.floor(KW.y / 90) * Nq.mapwidth + Wo * Nq.mapwidth + WJ - WT / 2;
            if (Wd < 0)
                Wd = 0;
            let Ww = Wd + WT;
            if (Ww > Nq.map.length)
                Ww = Nq.map.length;
            for (let WP = Wd; WP < Ww; WP++) {
                if (Nq.map[WP].liquid)
                    Nq.map[WP].draw(KB, Kl, KW, KK);
            }
        }
        for (let WH = 0; WH < Nq.particles.length; WH++) {
            if (Nq.particles[WH]['delete']) {
                Nq.particles.splice(WH, 1);
                WH--;
                continue;
            }
            ie(Nq.particles[WH], KB, Kl, KW, KK);
        }
        Nq.playersOn = Ks;
        if (xC) {
            NM.font = 'bold ' + Math.round(KK * 22) + 'px Quicksand';
            NM.fillStyle = 'rgba(0, 0, 0, 0.3)';
            let Wt = NM.measureText(Nq.chatmsg).width + 2;
            NM.fillStyle = 'rgba(0, 0, 0, 0.5)';
            NM.fillRect(NQ.width / 2 - Wt / 2, NQ.height / 2 - 58 / 2 - 45, Wt, 24);
            NM.fillStyle = 'white';
            NM.fillText(Nq.chatmsg, NQ.width / 2 - Wt / 2, NQ.height / 2 - 58 / 2 - 30);
        }
        if (Nq.bgeffect != null) {
            NM.fillStyle = Nq.bgeffect.color;
            NM.globalAlpha = Nq.bgeffect.opacity;
            NM.fillRect(0, 0, NQ.width, NQ.height);
            NM.globalAlpha = 1;
            Nq.bgeffect.func();
        }
        Nq.weatherManager.renderWeather(KW.x, KW.y);
        if (Nq.videoMode) {
            requestAnimationFrame(NZ);
            return;
        }
        iM();
        iQ();
        if (Nq.ingame) {
            const WV = Date.now();
            let Wj = 1 - (Nq.dash.end - WV) / Nq.dash.time;
            Wj = Math.max(0, Math.min(1, Wj));
            if (Nq.xp < Ky.xp)
                Nq.xp += (Ky.xp - Nq.xp) / 10;
            if (Nq.xp > Ky.xp)
                Nq.xp = Ky.xp;
            const Wc = Math.pow(Ky.lvl, 3);
            const Wq = Math.pow(Ky.lvl + 1, 3);
            if (Nq.xp < Wc)
                Nq.xp = Wc;
            const Wb = Math.max(0, Math.min(1, (Nq.xp - Wc) / (Wq - Wc)));
            Nt.clearRect(0, 0, NH.width, NH.height);
            const WF = 10;
            const WU = 4;
            const WC = WF;
            const Wz = NH.width - WF * 2;
            const Wf = Wz * 0.25;
            const WR = 30;
            const Wm = N2.find(BK => BK > Ky.lvl);
            const Wn = 52;
            const B0 = WC + Wz - Wf;
            const B1 = WF;
            const B2 = 8;
            const B3 = B1 + WR + WU;
            const B4 = NH.height - B3;
            const B5 = WC;
            const B6 = B3 + (B4 - Wn) / 2;
            function KX(BK, BO, Bu, BW, BB) {
                if (Bu <= 0 || BW <= 0)
                    return;
                Nt.beginPath();
                Nt.roundRect(BK, BO, Bu, BW, Math.min(BB, Bu / 2, BW / 2));
            }
            function KY(BK, BO, Bu, BW, BB, Bl, Bs, BZ) {
                BB = Math.max(0, Math.min(1, BB));
                Nt.fillStyle = Bl;
                KX(BK, BO, Bu, BW, B2);
                Nt.fill();
                const Bp = 3;
                const Bh = (Bu - Bp * 2) * BB;
                if (Bh > 0) {
                    Nt.fillStyle = Bs;
                    KX(BK + Bp, BO + Bp, Bh, BW - Bp * 2, B2 - 2);
                    Nt.fill();
                }
                Nt.strokeStyle = BZ;
                Nt.lineWidth = 2;
                KX(BK, BO, Bu, BW, B2);
                Nt.stroke();
            }
            const B7 = 'rgba(0, 0, 0, 0.4)';
            const B8 = B0 - WF;
            const B9 = Wm == null ? null : Wm - Ky.lvl;
            const BI = Wm == null ? null : 'WEAPON UPGRADE IN ' + B9 + ' ' + (B9 === 1 ? 'LEVEL' : 'LEVELS');
            const Ba = 10;
            const BG = 6;
            let Bi = 26;
            let BN = 0;
            if (Wm != null) {
                Nt.font = '700 ' + Bi + 'px quicksand';
                const BK = B8 - WU - Ba - BG * 2;
                const BO = Nt.measureText(BI).width;
                if (BO > BK) {
                    Bi = Math.max(16, Bi * BK / BO);
                    Nt.font = '700 ' + Bi + 'px quicksand';
                }
                BN = Nt.measureText(BI).width + BG * 2;
                Nt.fillStyle = B7;
                Nt.beginPath();
                Nt.moveTo(Ba, B3);
                Nt.lineTo(Ba, 14);
                Nt.quadraticCurveTo(Ba, 0, Ba + 14, 0);
                Nt.lineTo(Ba + BN - 14, 0);
                Nt.quadraticCurveTo(Ba + BN, 0, Ba + BN, 14);
                Nt.lineTo(Ba + BN, B3);
                Nt.closePath();
                Nt.fill();
            }
            Nt.fillStyle = B7;
            Nt.beginPath();
            Nt.moveTo(B8 + 14, 0);
            Nt.lineTo(NH.width - 14, 0);
            Nt.quadraticCurveTo(NH.width, 0, NH.width, 14);
            Nt.lineTo(NH.width, NH.height);
            Nt.lineTo(0, NH.height);
            Nt.lineTo(0, B3 + 14);
            Nt.quadraticCurveTo(0, B3, 14, B3);
            Nt.lineTo(B8, B3);
            Nt.lineTo(B8, 14);
            Nt.quadraticCurveTo(B8, 0, B8 + 14, 0);
            Nt.closePath();
            Nt.fill();
            KY(B0, B1, Wf, WR, Wj, '#172517', Wj >= 1 ? '#8ee85d' : '#62b23e', '#518936');
            Nt.font = '700 20px quicksand';
            Nt.textBaseline = 'middle';
            Nt.textAlign = 'center';
            Nt.fillStyle = '#efffe8';
            Nt.fillText('DASH', B0 + Wf / 2, B1 + WR / 2);
            if (Wm != null) {
                Nt.font = '700 ' + Bi + 'px quicksand';
                Nt.textAlign = 'center';
                Nt.fillStyle = '#fff2c2';
                Nt.fillText(BI, Ba + BN / 2, B1 + WR / 2);
            }
            Nt.fillStyle = '#392810';
            KX(B5, B6, Wz, Wn, B2);
            Nt.fill();
            const Bx = 3;
            const By = (Wz - Bx * 2) * Wb;
            if (By > 0) {
                Nt.fillStyle = '#e1c278';
                KX(B5 + Bx, B6 + Bx, By, Wn - Bx * 2, B2 - 2);
                Nt.fill();
            }
            Nt.strokeStyle = '#896931';
            Nt.lineWidth = 2;
            KX(B5, B6, Wz, Wn, B2);
            Nt.stroke();
            Nt.font = '700 32px quicksand';
            Nt.textBaseline = 'middle';
            Nt.textAlign = 'left';
            Nt.lineWidth = 4;
            Nt.fillStyle = '#fff2c2';
            Nt.strokeText('LVL ' + Ky.lvl, B5 + 12, B6 + Wn / 2);
            Nt.fillText('LVL ' + Ky.lvl, B5 + 12, B6 + Wn / 2);
            Nt.font = '500 28px quicksand';
            Nt.textAlign = 'right';
            Nt.fillText(Math.floor(Nq.xp) + ' / ' + Wq, B5 + Wz - 12, B6 + Wn / 2);
            Nt.textAlign = 'left';
            Nt.textBaseline = 'alphabetic';
        }
        NM.globalAlpha = 1;
        let KM = Nq.minimap;
        if (!Nq.mobile && Nq.ingame) {
            NV.clearRect(0, 0, KM.width, KM.height);
            NV.drawImage(KM, 0, 0);
            NV.fillStyle = 'red';
            let Bu = KW.x / (Nq.mapwidth * Ia) * KM.width;
            let BW = KW.y / (Nq.mapheight * IG) * KM.height;
            NV.fillRect(Bu - 2, BW - 2, KM.width / 50, KM.width / 50);
            if (Kx.k.length > 0 && Nq.gamemode == 'FFA' && Kx.k[0].world == Nq.world) {
                Np(Kx.k[0].x, Kx.k[0].y, './images/crown.png');
            }
        }
        requestAnimationFrame(NZ);
    }
    function Np(Kx, Ky, KK) {
        let KO = Kx / (Nq.mapwidth * Ia) * minimap.width;
        let Ku = Ky / (Nq.mapheight * IG) * minimap.height;
        NV.drawImage(Nc[KK], KO - 10, Ku - 10);
    }
    'use strict';
    class Nh {
        constructor(Kx, {onRequired: Ky, onSuccess: KK}) {
            this.socket = Kx;
            this.onRequired = Ky;
            this.onSuccess = KK;
            this.challenge = null;
            this.widgetId = null;
            this.generation = 0;
            this.joinRequested = ![];
            Kx.on('CAPTCHA_REQUIRED', KO => this.show(KO));
            Kx.on('CAPTCHA_SUCCESS', () => {
                if (!this.challenge)
                    return;
                const KO = this.joinRequested && this.challenge.reason === 'join';
                this.close();
                if (KO)
                    this.onSuccess();
            }
            );
            Kx.on('CAPTCHA_FAILED', KO => {
                this.createPanel();
                this.openPanel();
                this.onRequired(this.challenge);
                this.message.textContent = KO?.message || 'Verification failed. Please try again.';
                this.retry.disabled = ![];
            }
            );
        }
        ['createPanel']() {
            if (this.panel)
                return;
            this.panel = document.createElement('dialog');
            this.panel.setAttribute('aria-labelledby', 'bot-captcha-title');
            this.panel.style.cssText = 'position:fixed;inset:0;margin:auto;color:#fff;background:#263b38;border:2px solid #8eb8a4;border-radius:12px;padding:24px;max-width:calc(100vw - 32px);text-align:center;z-index:2147483646';
            this.backdrop = document.createElement('div');
            this.backdrop.style.cssText = 'position:fixed;inset:0;background:#0009;z-index:2147483645';
            this.backdrop.hidden = !![];
            this.panel.addEventListener('cancel', Ky => Ky.preventDefault());
            const Kx = document.createElement('h2');
            Kx.id = 'bot-captcha-title';
            Kx.textContent = 'Human verification';
            this.message = document.createElement('p');
            this.message.setAttribute('role', 'status');
            this.widget = document.createElement('div');
            this.retry = document.createElement('button');
            this.retry.textContent = 'Try again';
            this.retry.style.cssText = 'margin-top:16px;padding:10px 18px;cursor:pointer';
            this.retry.onclick = () => {
                if (this.challenge)
                    this.render();
                else {
                    const Ky = this.joinRequested;
                    this.close();
                    if (Ky)
                        this.onSuccess();
                }
            }
            ;
            this.panel.append(Kx, this.message, this.widget, this.retry);
            document.body.append(this.backdrop, this.panel);
        }
        ['openPanel']() {
            this.backdrop.hidden = ![];
            if (!this.panel.open)
                this.panel.show();
        }
        async loadProvider() {
            if (!Nh.loading) {
                if (window.turnstile)
                    return window.turnstile;
                Nh.loading = new Promise( (Kx, Ky) => {
                    const KK = document.createElement('script');
                    KK.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=realmzTurnstileLoaded&render=explicit';
                    KK.async = !![];
                    const KO = setTimeout( () => {
                        KK.remove();
                        Ky(new Error('Verification could not load. Please try again.'));
                    }
                    , 15000);
                    window.realmzTurnstileLoaded = () => {
                        clearTimeout(KO);
                        Kx(window.turnstile);
                    }
                    ;
                    KK.onerror = () => {
                        clearTimeout(KO);
                        KK.remove();
                        Ky(new Error('Verification could not load. Please try again.'));
                    }
                    ;
                    document.head.append(KK);
                }
                )['catch'](Kx => {
                    Nh.loading = null;
                    throw Kx;
                }
                );
            }
            return Nh.loading;
        }
        ['show'](Kx) {
            if (this.challenge && this.challenge.siteKey === Kx.siteKey)
                return;
            this.challenge = Kx;
            this.createPanel();
            this.onRequired(Kx);
            this.openPanel();
            this.render();
        }
        async render() {
            const Kx = ++this.generation;
            this.retry.disabled = !![];
            this.message.textContent = this.challenge.reason === 'respawn' ? 'Complete this check to respawn.' : 'Complete this check to enter the game.';
            try {
                const Ky = await this.loadProvider();
                if (Kx !== this.generation || !this.challenge)
                    return;
                if (this.widgetId != null)
                    Ky.remove(this.widgetId);
                this.widgetId = Ky.render(this.widget, {
                    'sitekey': this.challenge.siteKey,
                    'action': 'realmz-game',
                    'theme': 'dark',
                    'callback': KK => {
                        if (Kx !== this.generation)
                            return;
                        this.message.textContent = 'Checking verification…';
                        this.socket.emit('CAPTCHA_RESPONSE', {
                            'token': KK
                        });
                    }
                    ,
                    'expired-callback': () => this.failed(Kx, 'Verification expired. Please try again.'),
                    'error-callback': () => {
                        this.failed(Kx, 'Verification could not load. Please try again.');
                        return !![];
                    }
                    ,
                    'timeout-callback': () => this.failed(Kx, 'Verification timed out. Please try again.')
                });
            } catch (KK) {
                this.failed(Kx, KK.message);
            }
        }
        ['failed'](Kx, Ky) {
            if (Kx !== this.generation)
                return;
            this.message.textContent = Ky;
            this.retry.disabled = ![];
        }
        ['requestJoin']() {
            this.joinRequested = !![];
        }
        ['cancelJoin']() {
            this.joinRequested = ![];
        }
        ['close']() {
            this.generation++;
            if (this.widgetId != null)
                window.turnstile?.remove(this.widgetId);
            this.widgetId = null;
            this.challenge = null;
            this.cancelJoin();
            this.panel?.close();
            if (this.backdrop)
                this.backdrop.hidden = !![];
        }
    }
    'use strict';
    const Ng = new F(null,['none', yn()]);
    const Nr = new Nh(Ng,{
        'onRequired': Kx => {
            Nq.ingame = ![];
            yI();
            if (Kx?.reason === 'respawn') {
                Nq.deathscreen = !![];
                i('DEATH_SCREEN_BOX').style.visibility = 'visible';
                i('DEATH_SCREEN_BOX').style.position = 'relative';
            }
        }
        ,
        'onSuccess': () => window.respawn()
    });
    const ND = 'isTrusted';
    Ng.on('JOIN_FAILED', Kx => {
        Nr.close();
        yI();
        yK();
        i('infoText').textContent = Kx?.message || 'Could not enter the game. Please try again.';
    }
    );
    document.addEventListener('visibilitychange', () => {
        Ng.emit('analyticsVisibility', {
            'sessionId': U.getSessionId(),
            'hidden': document.hidden
        });
    }
    );
    window.testFreeze = () => {
        const Kx = performance.now();
        while (performance.now() - Kx < 2000) {}
    }
    ;
    const NQ = document.getElementById('canvas');
    const NM = NQ.getContext('2d');
    NM.textRendering = 'optimizeSpeed';
    NQ.width = 1920;
    NQ.height = 1080;
    var NY = {
        'fps': 0,
        'updates': 0
    };
    NY.updates++;
    let NX = [];
    function NE() {
        return {
            'start': Date.now(),
            'pageLoad': null,
            'socketInitEvent': null,
            'loadMap': null,
            'playClicked': null,
            'averagePing': null,
            'pingMedian': null,
            'pingP95': null,
            'pingMax': null,
            'pingSamples': 0,
            'averageFPS': null,
            'minFPS': null,
            'fpsMedian': null,
            'fpsP10': null,
            'fpsP95': null,
            'fpsSamples': 0,
            'longTaskCount': 0,
            'longTaskTotalMs': 0,
            'longTaskMaxMs': 0,
            'longTasksOver100ms': 0,
            'longTasksOver250ms': 0,
            'longTasksOver500ms': 0,
            'timerDriftP95Ms': null,
            'timerDriftMaxMs': null,
            'timerDriftsOver100ms': 0,
            'timerDriftsOver250ms': 0,
            'timerDriftsOver500ms': 0,
            'connectedServer': null,
            'documentHiddenSampleCount': 0,
            'rid': Math.round(Math.random() * 100000)
        };
    }
    const Nv = 300;
    const Ne = 100;
    function NL() {
        return {
            'values': [],
            'nextIndex': 0,
            'max': null
        };
    }
    let NS = {
        'ping': NL(),
        'fps': NL(),
        'timerDrift': NL()
    };
    let NA = null;
    function Nk(Kx, Ky) {
        if (Kx.values.length < Nv) {
            Kx.values.push(Ky);
        } else {
            Kx.values[Kx.nextIndex] = Ky;
            Kx.nextIndex = (Kx.nextIndex + 1) % Nv;
        }
        if (Kx.max == null || Ky > Kx.max)
            Kx.max = Ky;
    }
    function No(Kx, Ky) {
        if (Kx.values.length === 0)
            return null;
        const KK = Kx.values.slice().sort( (KB, Kl) => KB - Kl);
        const KO = (KK.length - 1) * Ky;
        const Ku = Math.floor(KO);
        const KW = Math.ceil(KO);
        if (Ku === KW)
            return KK[Ku];
        return KK[Ku] + (KK[KW] - KK[Ku]) * (KO - Ku);
    }
    function NT() {
        Nq.loadPerformance = NE();
        NS = {
            'ping': NL(),
            'fps': NL(),
            'timerDrift': NL()
        };
        NA = performance.now() + Ne;
    }
    function NJ() {
        const Kx = Nq.loadPerformance;
        if (document.hidden === !![]) {
            Kx.documentHiddenSampleCount++;
            return;
        }
        if (Number.isFinite(NY.fps)) {
            Kx.fpsSamples++;
            Kx.averageFPS = Kx.averageFPS == null ? NY.fps : Kx.averageFPS + (NY.fps - Kx.averageFPS) / Kx.fpsSamples;
            if (Kx.minFPS == null || NY.fps < Kx.minFPS)
                Kx.minFPS = NY.fps;
            Nk(NS.fps, NY.fps);
        }
        if (Number.isFinite(Nq.ping) && Nq.ping > 0) {
            Kx.pingSamples++;
            Kx.averagePing = Kx.averagePing == null ? Nq.ping : Kx.averagePing + (Nq.ping - Kx.averagePing) / Kx.pingSamples;
            Nk(NS.ping, Nq.ping);
        }
    }
    function Nd() {
        if (!Nq.ingame)
            return;
        let Kx = Nq.updatePlayerData.player.x;
        let Ky = Nq.updatePlayerData.player.y;
        i('infoText').innerHTML = '';
        for (let KK in Nq.interactableAreas) {
            let KO = Nq.interactableAreas[KK];
            if (Math.hypot(KO.x - Kx, KO.y - Ky) < KO.r) {
                i('infoText').innerHTML = KO.text ?? '';
            }
        }
    }
    const Nw = document.getElementById('shadowCanvas');
    const NP = Nw.getContext('2d');
    const NH = document.getElementById('guiCanvas');
    const Nt = NH.getContext('2d');
    const NV = i('minimap').getContext('2d');
    class Nj {
        constructor() {
            this.weight = 0;
            this.storage = new Array(4 * 9).fill(0);
        }
        ['add'](Kx, Ky) {
            for (let KK = 0; KK < this.storage.length; KK++) {
                if (this.storage[KK] === 0) {
                    this.set(KK, Kx, Ky);
                    return KK;
                }
            }
            return ![];
        }
        ['set'](Kx, Ky, KK) {
            this.storage[Kx] = [Ky, KK];
            let KO = document.querySelector('#inventory canvas[inventoryID=\'' + Kx + '\x27');
            let Ku = 0;
            KO.width = 50 + Ku;
            KO.height = 50 + Ku;
            let KW = KO.getContext('2d');
            KW.font = '20px quicksand';
            KW.fillStyle = 'white';
            KW.lineWidth = 2;
            KW.strokeStyle = 'black';
            KW.drawImage(Nc['./images/itemmap.png'], 50 * (Ky % 20), 50 * Math.floor(Ky / 20), 50, 50, Ku / 2, Ku / 2, 50, 50);
            KW.strokeText(KK, 50 - KW.measureText(KK).width, 45);
            KW.fillText(KK, 50 - KW.measureText(KK).width, 45);
        }
        ['get'](Kx) {
            if (this.storage[Kx] !== 0)
                return {
                    'type': this.storage[Kx][0],
                    'amount': this.storage[Kx][1]
                };
            return {
                'type': 23,
                'amount': 0
            };
        }
        ['remove'](Kx, Ky) {
            this.storage[Kx] -= Ky;
            if (this.storage[Kx] <= 0)
                delete this.storage[Kx];
        }
        ['reset']() {
            this.weight = 0;
            this.storage = new Array(4 * 9).fill(0);
        }
        ['refresh']() {
            for (let Kx = 0; Kx < this.storage.length; Kx++) {
                let Ky = this.get(Kx).type;
                i('inventory').innerHTML += '<canvas width=50 height=50 inventoryID=' + Kx + '></canvas>';
            }
        }
    }
    window.onresize = function() {
        xc();
    }
    ;
    if (localStorage.getItem('visited') == null) {}
    if (localStorage.getItem('playedBefore') == null) {
        localStorage.setItem('playedBefore', 'false');
    }
    window.showWelcomeBox = function() {
        document.getElementById('startingMessage').style.visibility = 'visible';
    }
    ;
    window.hideWelcomeBox = function() {
        document.getElementById('startingMessage').style.visibility = 'hidden';
        localStorage.setItem('visited', !![]);
    }
    ;
    window.hideUpdatePopup = function() {
        localStorage.setItem('visited-realmz-nov-2025', 0);
        closeStatusBox();
    }
    ;
    const Nc = {};
    const Nq = {
        'version': '3.1.perf',
        'sounds': {
            'slash': gameAsset('./sounds/swing.flac'),
            'gun': gameAsset('./sounds/gun.wav'),
            'whoosh': gameAsset('./sounds/whoosh.wav'),
            'whooshFast': gameAsset('./sounds/whooshFast.mp3'),
            'swing': gameAsset('./sounds/swing.flac'),
            'magic': gameAsset('./sounds/magic.wav'),
            'magic2': gameAsset('./sounds/magic2.mp3'),
            'bow': gameAsset('./sounds/bow.mp3'),
            'rocket': gameAsset('./sounds/rocket.mp3')
        },
        'playSound': (Kx, Ky) => {
            if (Kx == 'none')
                return;
            let KK = new Audio(Nq.sounds[Kx]);
            KK.addEventListener('error', () => console.error('[assets] sound "' + Kx + '" failed to load: ' + Nq.sounds[Kx]));
            KK.volume = (Ky ?? 1) * Nq.settings.soundVolume / 100;
            KK.play();
        }
        ,
        'GAME_TICK': 0,
        'init': ![],
        'upgrades': {
            's': null,
            'regen': null,
            'jump': null,
            'dash': null
        },
        'autoUpgrades': {},
        'autoUpgradeHash': '',
        'autoUpgradeStep': 0,
        'weatherManager': new d(),
        'ingame': ![],
        'minimap': new OffscreenCanvas(10,10),
        'notif': null,
        'angle': 0,
        'autoattack': ![],
        'weapon': 'NoWeapon',
        'freeze': ![],
        'stealth': ![],
        'stealthCooldown': ![],
        'xp': 0,
        'playersOn': 0,
        'updateData': {
            'proj': [],
            'xp': [],
            'gameData': ''
        },
        'players': {},
        'adinplay': !![],
        'crazygames': ![],
        'mobs': {},
        'updatePlayerData': {
            'player': {
                'x': 0,
                'y': 0,
                'lastX': 0,
                'lastY': 0,
                'lastServerX': 0,
                'lastServerY': 0
            },
            'xp': 0,
            'time': Date.now(),
            'lvl': 0
        },
        'projectiles': {},
        'lights': [],
        'inventory': new Nj(),
        'you': null,
        'camera': {
            'randomPan': CLIENT_TYPE === 'v1',
            'panX': 0,
            'panY': 0,
            'panTarget': {
                'x': 0,
                'y': 0
            },
            'velX': 0,
            'velY': 0
        },
        'scale': 1,
        'items': {},
        'itemsEnabled': ![],
        'panDir': 45,
        'notifs': [],
        'renderStart': Date.now(),
        'trees': [],
        'itemData': [],
        'flowers': [],
        'particles': [],
        'tutorial': null,
        'clouds': [],
        'now': {
            'x': 0,
            'y': 0,
            'time': 0
        },
        'last': {
            'x': 0,
            'y': 0,
            'time': 0
        },
        'mouseX': 0,
        'clientX': 0,
        'prediction': ![],
        'clientY': 0,
        'mobile': ![],
        'uuid': '',
        'mouseY': 0,
        'chatmsg': '',
        'map': [],
        'mapSettings': {
            'caveStart': 7000
        },
        'bushes': [],
        'ping': 0,
        'sentPing': 0,
        'mapwidth': 0,
        'mapheight': 0,
        'dash': {
            'end': 0,
            'time': 100
        },
        'servers': {},
        'otherServers': {},
        'bgeffect': null,
        'background': {},
        'interactableAreas': [],
        'filter': {
            'bgtop': '#73A7FC',
            'hue': 0,
            'pos': 0
        },
        'filters': [{
            'bgtop': '#73A7FC',
            'hue': 0,
            'pos': 0
        }, {
            'bgtop': '#10337a',
            'hue': 280,
            'pos': 1
        }],
        'texturePack': 'default',
        'settings': {
            'names': !![],
            'background': !![],
            'clouds': !![],
            'chat': !![],
            'highdetail': !![],
            'drawparticles': !![],
            'showdevice': ![],
            'details': !![],
            'shadows': !![],
            'musicVolume': 100,
            'soundVolume': 100,
            'autoUpgrade': ![]
        },
        'keys': {
            'freeze': 'p',
            'attack': 'o',
            'autoattack': 'e',
            'left': 'a',
            'right': 'd',
            'jump': 'w',
            'stealth': 'i',
            'dash': ' ',
            'interact': 'f'
        },
        '_keys': {
            'freeze': 'p',
            'attack': 'o',
            'autoattack': 'e',
            'left': 'a',
            'right': 'd',
            'jump': 'w',
            'stealth': 'i',
            'dash': ' ',
            'interact': 'f'
        },
        'awaitKeybind': null,
        'settingsOpen': ![],
        'weapon': 'NoWeapon',
        'upgradesOpen': !![],
        'helpOpen': ![],
        'connectedserver': null,
        'showWeaponMenu': !![],
        'skins': {},
        'skin': 'blue',
        'skinImageCache': {},
        'tilesrcs': {},
        'flowerQueue': [],
        'mobQueue': [],
        'playercount': 0,
        'biome': {
            'current': 'grass',
            'change': 0,
            'prev': 'grass',
            'fog': 'rgba(0, 0, 0, 0)',
            'bg': null
        },
        'gamestate': {
            'timeEnd': 0,
            'redTeamScore': 0,
            'blueTeamScore': 0
        },
        'ready': {
            'files': ![],
            'map': ![]
        },
        'loadPerformance': NE()
    };
    NA = performance.now() + Ne;
    document.addEventListener('visibilitychange', () => {
        NA = performance.now() + Ne;
    }
    );
    setInterval( () => {
        const Kx = performance.now();
        const Ky = Math.max(0, Kx - NA);
        NA = Kx + Ne;
        if (document.hidden === !![])
            return;
        const KK = Nq.loadPerformance;
        Nk(NS.timerDrift, Ky);
        if (Ky > 100)
            KK.timerDriftsOver100ms++;
        if (Ky > 250)
            KK.timerDriftsOver250ms++;
        if (Ky > 500)
            KK.timerDriftsOver500ms++;
    }
    , Ne);
    if (typeof PerformanceObserver !== 'undefined') {
        try {
            const Kx = new PerformanceObserver(Ky => {
                if (document.hidden === !![])
                    return;
                const KK = Nq.loadPerformance;
                for (const KO of Ky.getEntries()) {
                    const Ku = KO.duration;
                    if (!Number.isFinite(Ku) || Ku < 0)
                        continue;
                    KK.longTaskCount++;
                    KK.longTaskTotalMs += Ku;
                    KK.longTaskMaxMs = Math.max(KK.longTaskMaxMs, Ku);
                    if (Ku > 100)
                        KK.longTasksOver100ms++;
                    if (Ku > 250)
                        KK.longTasksOver250ms++;
                    if (Ku > 500)
                        KK.longTasksOver500ms++;
                }
            }
            );
            Kx.observe({
                'type': 'longtask',
                'buffered': !![]
            });
        } catch {}
    }
    function Nb() {
        const Ky = structuredClone(Nq.loadPerformance);
        Ky.pingMedian = No(NS.ping, 0.5);
        Ky.pingP95 = No(NS.ping, 0.95);
        Ky.pingMax = NS.ping.max;
        Ky.fpsMedian = No(NS.fps, 0.5);
        Ky.fpsP10 = No(NS.fps, 0.1);
        Ky.fpsP95 = No(NS.fps, 0.95);
        Ky.timerDriftP95Ms = No(NS.timerDrift, 0.95);
        Ky.timerDriftMaxMs = NS.timerDrift.max;
        Ky.connectedServer = Nq.connectedserver ?? null;
        for (const KO of ['start', 'pageLoad', 'socketInitEvent', 'loadMap', 'playClicked']) {
            if (Ky[KO] != null)
                Ky[KO] -= Nq.loadPerformance.start;
        }
        Ky.session = U.getSessionId();
        Ky.clientVersion = Nq.version;
        Ky.crazygames = window.location.pathname === '/cg' || window.location.pathname.startsWith('/crazygames');
        Ky.screenWidth = window.screen.width;
        Ky.screenHeight = window.screen.height;
        Ky.devicePixelRatio = window.devicePixelRatio;
        Ky.hardwareConcurrency = navigator.hardwareConcurrency ?? null;
        Ky.deviceMemory = navigator.deviceMemory ?? null;
        Ky.canvasWidth = NQ.width;
        Ky.canvasHeight = NQ.height;
        let KK = 'https://metric.realmz.io/metric';
        if (!KK)
            return;
        return;
        return fetch(KK, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(Ky),
            'keepalive': !![]
        })['catch'](Ku => {
            console.warn('Failed to send performance report', Ku);
        }
        );
    }
    console.log('Build' + Nq.version);
    if (window.location.pathname == '/cg' || window.location.pathname.startsWith('/crazygames')) {
        Nq.adinplay = ![];
        Nq.crazygames = !![];
    }
    function NF(Ky) {
        Nc[Ky] = new Image();
        Nc[Ky].onerror = gameAssetImageError(gameAsset(Ky));
        Nc[Ky].src = gameAsset(Ky);
    }
    function NU(Ky) {
        let KK = Ky.charCodeAt(0).toString(2);
        return KK;
    }
    function NC(Ky) {
        let KK = 0;
        let KO = Ky.length - 1;
        for (let Ku = 0; Ku < Ky.length; Ku++) {
            KK += Ky.charCodeAt(Ku) * 128 ** KO;
            KO--;
        }
        return KK;
    }
    window.onload = function() {
        if (Nq.loadPerformance.pageLoad == null)
            Nq.loadPerformance.pageLoad = Date.now();
        xc();
    }
    ;
    function Nz(Ky, KK) {
        KK.v = 0;
        KK.sz = {
            'val': 20
        };
        KK.extrajump = {
            'val': 0,
            'max': 0
        };
        KK.lastX = KK.x;
        KK.lastY = KK.y;
        KK.getBoundingBox = KO => {
            let Ku = 50;
            return [KK.x - Ku / 2, KK.x + Ku / 2, KK.y - Ku / 2, KK.y + Ku / 2];
        }
        ;
        Nq.items[Ky] = KK;
    }
    Ng.on('item', (Ky, KK) => {
        if (Ky == 'add') {
            for (let KO in KK) {
                Nz(KO, KK[KO]);
            }
        }
        if (Ky == 'del') {
            for (let Ku in KK) {
                delete Nq.items[KK[Ku]];
            }
        }
        if (Ky == 'invadd') {
            Nq.inventory.set(KK.loc, KK.id, KK.amount);
        }
        if (Ky == 'invdel') {}
    }
    );
    let Nf = {};
    function NR(Ky) {
        const KK = document.createElement('canvas');
        KK.width = Ky.naturalWidth || Ky.width;
        KK.height = Ky.naturalHeight || Ky.height;
        const KO = KK.getContext('2d');
        KO.drawImage(Ky, 0, 0);
        let Ku = KO.getImageData(0, 0, KK.width, KK.height);
        let KW = (Kl, Ks) => {
            let KZ = Ku.data[Ks * KK.width * 4 + Kl * 4 + 3];
            return KZ;
        }
        ;
        let KB = KW(578, 441) === 255 && KW(126, 84) === 255 && KW(1400, 857) === 255 && KW(1076, 358) === 255;
        if (!KB) {
            Ng.emitBinary(new Uint8Array([88]));
        }
    }
    async function Nm() {
        xc();
        let Ky = ['./images/propsmap.png', './images/propsmap2.png', './images/borders.png', './images/bordersrock.png', './images/flowers.png', './images/weapons.png', './images/crown.png', './images/cloud.png', './images/SnowManMob.svg', './images/skins/blue.svg', './images/plasmaCannon.png', './images/mobsmap.png', './images/xpbar.png', './images/light/circle.png', './images/light/circle500r.png', './images/light/circle500g.png', './images/light/circle500b.png', './images/icons/desktop.png', './images/icons/question_mark.png', './images/icons/mobile.png', './images/icons/browser.png', './images/icons/bot.png', './images/icons/verified.png', './images/itemmap.png', './images/realmz.png', './images/shadowmap.png', './images/tutorial/controls1.png', './images/tutorial/controls2.png', './images/impact.png', './images/mirny/mirnymobs.png'];
        for (let Ku in Ky) {
            Nc[Ky[Ku]] = new Image();
            Nc[Ky[Ku]].onload = async () => {
                if (Ky[Ku] === './images/shadowmap.png') {
                    Io();
                }
            }
            ;
            if (Ky[Ku] in Nf) {
                Nc[Ky[Ku]].src = Nf[Ky[Ku]];
            } else {
                const KAu = gameAsset(Ky[Ku]);
                Nc[Ky[Ku]].onerror = gameAssetImageError(KAu);
                Nc[Ky[Ku]].src = KAu;
            }
        }
        let KK = {
            'skins': ![],
            'mobs': ![],
            'items': ![]
        };
        let KO = () => {
            for (let KW in KK) {
                if (!KK[KW])
                    return;
            }
            Nq.ready.files = !![];
            console.log('loaded more files');
            for (let KB in Nq.mobQueue) {
                xo(Nq.mobQueue[KB]);
            }
            Nq.mobQueue = [];
            x7();
            ya();
        }
        ;
        gameAssetJSON('/shared/mobs.json').then(KW => {
            Nq.mobData = KW;
            KK.mobs = !![];
            KO();
        }
        )['catch'](KW => console.error('[assets] shared/mobs.json not loaded; Nq.ready.files stays false', KW));
        gameAssetJSON('/shared/items.json').then(KW => {
            Nq.itemData = KW;
            KK.items = !![];
            KO();
        }
        )['catch'](KW => console.error('[assets] shared/items.json not loaded; Nq.ready.files stays false', KW));
        gameAssetJSON('/shared/skins.json').then(KW => {
            Nq.skins = KW;
            KK.skins = !![];
            KO();
        }
        )['catch'](KW => console.error('[assets] shared/skins.json not loaded; Nq.ready.files stays false', KW));
    }
    Ng.on('loadMap', (Ky, KK) => {
        Nn(KK, Ky);
    }
    );
    Ng.on('tile', Ky => {
        console.log(Ky);
        for (let KK = 0; KK < Ky.length; KK++) {
            let KO = Ky[KK];
            let Ku = KO.i;
            let KW = KO.id;
            let KB = ay(Ku, null, null, KW, Nq.mapwidth);
            Nq.map[Ku] = KB;
        }
        IC();
        aG(Ky);
    }
    );
    async function Nn(Ky, KK) {
        ai();
        Nq.ready.map = ![];
        Nq.projectiles = {};
        let KO = KK.name;
        if (CLIENT_TYPE === 'v1')
            i('mapname').innerHTML = 'Map: ' + KK.name;
        let Ku = '';
        Nq.mapSettings.caveStart = KK.caveStart;
        Nq.world = KK.world;
        Nq.mapSettings = KK;
        Nc.tiles = new Image();
        if ('tiles' in Nf) {
            Nc.tiles.src = Nf.tiles;
        } else {
            const KAt = gameAsset('./map/' + KO + '/tilemap.png');
            // same-origin keeps the original credentialed mode; cross-origin uses
            // anonymous CORS (credentialed CORS needs server opt-in and would fail)
            Nc.tiles.crossOrigin = gameAssetIsCrossOrigin(KAt) ? 'anonymous' : 'use-credentials';
            Nc.tiles.onerror = gameAssetImageError(KAt);
            Nc.tiles.src = KAt;
        }
        let KW = {
            'tiles': ![],
            'props': ![],
            'propsHash': ![],
            'lights': ![],
            'areas': ![],
            'map': ![]
        };
        let KB = () => {
            for (let Kl in KW) {
                if (!KW[Kl])
                    return;
            }
            aK(Nq, Ku, Ky, KK);
            Nq.ready.map = !![];
            if (Nq.ready.files)
                x9();
            for (let Ks in Nq.flowerQueue) {
                xd(Nq.flowerQueue[Ks]);
            }
            Nq.flowerQueue = [];
            console.log('ready');
            ya();
        }
        ;
        gameAssetJSON('/map/' + KO + '/tiles.json').then(Kl => {
            Nq.tileIndex = Kl;
            KW.tiles = !![];
            KB();
        }
        )['catch'](Kl => console.error('[assets] map "' + KO + '" tiles.json not loaded; Nq.ready.map stays false', Kl));
        gameAssetJSON('/map/' + KO + '/areas.json').then(Kl => {
            Nq.interactableAreas = Kl;
            KW.areas = !![];
            KB();
        }
        )['catch'](Kl => console.error('[assets] map "' + KO + '" areas.json not loaded; Nq.ready.map stays false', Kl));
        gameAssetJSON('/map/' + KO + '/props.json').then(Kl => {
            Nq.props = Kl;
            KW.props = !![];
            KB();
        }
        )['catch'](Kl => console.error('[assets] map "' + KO + '" props.json not loaded; Nq.ready.map stays false', Kl));
        gameAssetJSON('/map/' + KO + '/propsHash.json').then(Kl => {
            Nq.propsHash = Kl;
            KW.propsHash = !![];
            KB();
        }
        )['catch'](Kl => console.error('[assets] map "' + KO + '" propsHash.json not loaded; Nq.ready.map stays false', Kl));
        gameAssetJSON('/map/' + KO + '/lights.json').then(Kl => {
            Nq.lights = Kl;
            KW.lights = !![];
            KB();
        }
        )['catch'](Kl => console.error('[assets] map "' + KO + '" lights.json not loaded; Nq.ready.map stays false', Kl));
        gameAssetText('/map/' + KO + '/map.erthmap').then(Kl => {
            Ku = Kl;
            KW.map = !![];
            KB();
        }
        )['catch'](Kl => console.error('[assets] map "' + KO + '" map.erthmap not loaded; Nq.ready.map stays false', Kl));
    }
    window.onerror = (Ky, KK, KO, Ku, KW) => {
        let KB = 'm: ' + Ky + ', s: ' + KK + ', l: ' + KO + ', c: ' + KW + ', error: ' + KW;
        console.log('err');
        log(KB);
        let Kl = 'https://metric.realmz.io/metric';
        return;
        if (KB.includes('socket.close'))
            return;
        let Ks = {
            'type': 'error',
            'content': KB,
            'rid': Nq.loadPerformance.rid
        };
        Ks.session = U.getSessionId() ?? 'null-' + Math.random() + Math.random();
        Ks.crazygames = window.location.pathname === '/cg' || window.location.pathname.startsWith('/crazygames');
        fetch(Kl, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(Ks),
            'keepalive': !![]
        })['catch'](KZ => {
            console.warn('Failed to send performance report', KZ);
        }
        );
        return !![];
    }
    ;
    window.log = Ky => {
        console.log(Ky);
        if (typeof Ky == 'object')
            Ky = JSON.stringify(Ky);
        i('console').innerHTML += '<br>' + Ky;
        i('console').scrollTop = i('console').scrollHeight;
    }
    ;
    function x0(Ky, KK, KO) {
        if (Ky < KK)
            Ky = KK;
        if (Ky > KO)
            Ky = KO;
        return Ky;
    }
    window.openStatusBox = function(Ky, KK, KO) {
        let Ku = document.getElementById('statusbox');
        Ku.style.visibility = 'visible';
        Ku.innerHTML = '';
        Ku.innerHTML += Ky + '<div style="display: block;">';
        if (KK)
            Ku.innerHTML += '\n    <button class="sbu" style="width: 100%; height: 30px; font-size: 15px;" onclick=\'closeStatusBox()\'>Close</button>';
        if (KO != null) {
            Ku.innerHTML += '<button class="sbu" style="white-space: nowrap; width: 100%; height: 30px; font-size: 15px;" onclick="' + KO.onclick + '\x22>' + KO.name + '</button>';
        }
        Ku.innerHTML += '</div>';
    }
    ;
    if (localStorage.getItem('visited-realmz-nov-2025') == null) {}
    let x1 = null;
    let x2 = ![];
    function x3() {
        return 'Bearer ' + (localStorage.getItem('accSSID') || '');
    }
    async function x4() {
        let Ky = i('watchAdButton');
        if (!Ky)
            return;
        if (!localStorage.getItem('accSSID')) {
            Ky.disabled = !![];
            Ky.innerText = 'Log in to watch ads for coins';
            return;
        }
        try {
            let KK = await fetch(getAPIurl() + '/api/v2/ad-reward/status', {
                'headers': {
                    'Authorization': x3()
                }
            });
            if (!KK.ok)
                return;
            let KO = await KK.json();
            Ky.disabled = KO.remaining <= 0;
            Ky.innerText = KO.remaining > 0 ? 'Watch ad for ' + KO.reward + ' coins (' + KO.remaining + '/' + KO.limit + ' left today)' : 'No ads left today, come back tomorrow!';
        } catch (Ku) {}
    }
    async function x5() {
        console.log(x2, 'showing ad.');
        if (x2)
            return;
        if (!localStorage.getItem('accSSID')) {
            alert('Log in to an account to earn coins from ads!');
            return;
        }
        if (typeof aiptag === 'undefined' || typeof aiptag.adplayer === 'undefined') {
            alert('Ad couldn\'t load. Disable your ad blocker and try again.');
            return;
        }
        x2 = !![];
        try {
            let Ky = await fetch(getAPIurl() + '/api/v2/ad-reward/start', {
                'method': 'POST',
                'headers': {
                    'Authorization': x3()
                }
            });
            if (Ky.status === 429) {
                alert('No ads left today, come back tomorrow!');
                x2 = ![];
                x4();
                return;
            }
            if (!Ky.ok) {
                alert('Couldn\'t start the ad. Try again later.');
                x2 = ![];
                return;
            }
            let KK = await Ky.json();
            x1 = KK.attemptId;
            aiptag.cmd.player.push(function() {
                aiptag.adplayer.startRewardedAd({
                    'preload': ![],
                    'showLoading': !![]
                });
            });
        } catch (KO) {
            alert('Couldn\'t start the ad. Try again later.');
            x2 = ![];
        }
    }
    window.onRewardedAdGranted = async function() {
        let Ky = x1;
        x1 = null;
        x2 = ![];
        try {
            let KK = await fetch(getAPIurl() + '/api/v2/ad-reward/claim', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': x3()
                },
                'body': JSON.stringify({
                    'attemptId': Ky
                })
            });
            let KO = await KK.json();
            if (KO.ok) {
                alert('You earned ' + KO.reward + ' coins!');
            } else {
                alert('Couldn\'t grant the reward. Try again later.');
            }
        } catch (Ku) {
            alert('Couldn\x27t grant the reward. Try again later.');
        } finally {
            x4();
            R();
        }
    }
    ;
    window.onRewardedAdNotGranted = function(Ky) {
        x1 = null;
        x2 = ![];
        if (Ky && Ky !== 'closed') {
            alert('No ad available right now. Try again later.');
        }
    }
    ;
    function x6() {
        x5();
    }
    window.showRewardedAd = x5;
    Nm();
    function x7() {
        console.log('initializing game..');
        if (CLIENT_TYPE === 'v1')
            document.getElementById('name').value = localStorage.getItem('name');
        let Ky = document.querySelector('meta[name="realmz-device-type"]').content;
        if (Ky == 'mobile')
            xj();
        xb('auto', 0);
        xb('frozen', 0);
        xb('stealth', 0);
        X();
        for (let KK in Nq.settings) {
            if (KK === 'autoUpgrade')
                continue;
            if (Ky == 'mobile')
                break;
            let KO = localStorage.getItem('settings' + KK);
            if (KO == null)
                continue;
            let Ku = document.getElementById('settingscheckbox' + KK);
            if (Ku.type === 'range') {
                let KW = parseInt(KO);
                if (isNaN(KW))
                    KW = 100;
                Ku.value = KW;
                Nq.settings[KK] = KW;
            } else {
                KO = KO.toLowerCase() == 'true';
                Ku.checked = KO;
                Nq.settings[KK] = KO;
            }
        }
        for (let KB = 0; KB < 17; KB++) {
            Nq.clouds.push({
                'x': Math.round(Math.random() * (NQ.width + 490)) - 490,
                'y': Math.round(Math.random() * NQ.height),
                's': Math.round(Math.random() * 2) + 1,
                'sz': Math.random()
            });
        }
        Nq.init = !![];
        console.log('init');
        if (Nq.ready.map)
            x9();
        for (let Kl in Nq.keys) {
            if (Ky == 'mobile')
                break;
            let Ks = localStorage.getItem('keybind' + Kl);
            if (Ks == null)
                continue;
            Nq.keys[Kl] = Ks.toLowerCase();
            if (Ks == ' ')
                Ks = 'Spacebar';
            let KZ = document.getElementById('keybind' + Kl);
            if (KZ)
                KZ.innerHTML = Ks;
        }
        setInterval( () => {
            NY.fps = NY.updates;
            NY.updates = 0;
            NJ();
            document.getElementById('count').textContent = Nq.playersOn + ' Players On - FPS: ' + NY.fps + ' - Ping: ' + Nq.ping + ' ms';
            if (NY.fps < 40) {
                Nq.settings.details = ![];
            } else {
                Nq.settings.details = !![];
            }
            Nd();
            P.startMusic('main', 0.5);
        }
        , 1000);
        if (Nq.mobile) {}
    }
    const x8 = 2;
    function x9() {
        let Ky = x8;
        const KK = 7 + x8 * 2;
        const KO = 4 + x8 * 2;
        const Ku = 1 + x8 * 2;
        Ng.bin(0, KW => {
            let KB = Date.now();
            let Kl = KW.charCodeAt(1);
            KW = KW.substring(2);
            let Ks = {
                'time': Date.now(),
                'player': {
                    'x': 0,
                    'y': 0,
                    'lastX': 0,
                    'lastY': 0,
                    'id': 0
                },
                'xp': 0,
                'lvl': 0,
                'ply': {},
                'mobs': [],
                'lastCheck': Kl
            };
            let KZ = KW.charCodeAt(0);
            let Kp = KW.charCodeAt(1);
            let Kh = KW.charCodeAt(Kp * KK + 2);
            let Kg = KW.substring(2, Kp * KK + 2);
            let Kr = KW.substring(Kp * KK + 3, Kp * KK + 3 + Kh * KO);
            let KD = KW.charCodeAt(Kp * KK + 3 + Kh * KO);
            let KQ = KW.substring(Kp * KK + 3 + Kh * KO + 1, Kp * KK + 3 + Kh * KO + KD * Ku + 1);
            let KM = [];
            for (let KX = 0; KX < KQ.length; KX += Ku) {
                let KE = KQ.substring(KX, KX + Ku);
                KM.push({
                    'x': NC(KE.substring(0, Ky)),
                    'y': NC(KE.substring(Ky, 2 * Ky)),
                    'sz': parseInt(KE[Ku - 1])
                });
            }
            Nq.updateData.xp = KM;
            let KY = KW.substring(3 + Kp * KK + Kh * KO + 1 + KD * Ku).split('.');
            Ks.lvl = parseInt(KY[0]);
            Ks.xp = parseInt(KY[1]);
            for (let Kv = 0; Kv < Kg.length; Kv += KK) {
                if (Kp == 0)
                    continue;
                let Ke = Kg.substring(Kv, Kv + KK);
                let KL = NU(Ke[0]);
                let KS = NU(Ke[KK - 1]);
                let KA = {
                    'y': NC(Ke.substring(1, 1 + Ky)) * (KS[2] * 2 - 1),
                    'x': NC(Ke.substring(1 + Ky, 1 + 2 * Ky)) * (KS[1] * 2 - 1),
                    'hp': Ke.charCodeAt(2 * Ky + 1),
                    'facing': parseInt(KL[1]) * 2 - 1,
                    'a': parseInt(KL[2]),
                    'i': parseInt(KL[3]),
                    'weapon': {
                        'facing': parseInt(KL[4]) * 2 - 1,
                        'e': parseInt(KL[5]),
                        'x': Ke.charCodeAt(2 * Ky + 2) * (KS[3] * 2 - 1),
                        'y': Ke.charCodeAt(2 * Ky + 3) * (KS[4] * 2 - 1),
                        'angle': Ke.charCodeAt(2 * Ky + 4)
                    }
                };
                if (KL.length == 9) {
                    KA.weapon.u = parseInt(KL.substring(6), 2);
                }
                Ks.ply[Ke.charCodeAt(2 * Ky + 5)] = KA;
            }
            for (let Kk = 0; Kk < Kr.length; Kk += KO) {
                let Ko = Kr.substring(Kk, Kk + KO);
                let KT = NU(Ko[2 * Ky]);
                let KJ = Ko.charCodeAt(2 * Ky + 2);
                let Kd = {
                    'y': NC(Ko.substring(0, Ky)) * (KT[3] * 2 - 1),
                    'x': NC(Ko.substring(Ky, 2 * Ky)) * (KT[2] * 2 - 1),
                    'facing': parseInt(KT[1]) * 2 - 1,
                    'hp': Ko.charCodeAt(2 * Ky + 1),
                    'rotation': Ko.charCodeAt(2 * Ky + 3)
                };
                Ks.mobs[KJ] = Kd;
            }
            if (KZ !== 0) {
                Ks.player.lastX = xI(Nq.updatePlayerData.player);
                Ks.player.lastY = xa(Nq.updatePlayerData.player);
                Ks.player.lastServerX = Nq.updatePlayerData.player.x;
                Ks.player.lastServerY = Nq.updatePlayerData.player.y;
                Ks.player.x = Ks.ply[KZ].x;
                Ks.player.y = Ks.ply[KZ].y;
            }
            Ks.player.id = KZ;
            for (let Kw in Nq.players) {
                if (!Nq.players[Kw].persistent)
                    Nq.players[Kw].hide = !![];
            }
            for (let KP in Ks.ply) {
                let KH = Nq.players[KP];
                if (KH.weapon.type == 'Emote') {
                    if (KH.weapon.x !== Ks.ply[KP].weapon.x) {
                        KH.weapon.lastChange = Date.now();
                        KH.weapon.lastEmote = KH.weapon.x;
                    }
                    if (KH.weapon.lastChange == -1)
                        KH.weapon.lastChange = Date.now();
                }
                Nq.players[KP].lastX = xI(Nq.players[KP]);
                Nq.players[KP].lastY = xa(Nq.players[KP]);
                Nq.players[KP].weapon.lastX = xI(Nq.players[KP].weapon);
                Nq.players[KP].weapon.lastY = xa(Nq.players[KP].weapon);
                Nq.players[KP].weapon.lastAngle = xi(Nq.players[KP].weapon);
                Nq.players[KP].lastServerX = Nq.players[KP].x;
                Nq.players[KP].lastServerY = Nq.players[KP].y;
                Nq.players[KP].weapon.lastServerX = Nq.players[KP].weapon.x;
                Nq.players[KP].weapon.lastServerY = Nq.players[KP].weapon.y;
                Nq.players[KP].hide = ![];
                for (let Kt in Ks.ply[KP]) {
                    if (Kt == 'weapon') {
                        for (let KV in Ks.ply[KP].weapon)
                            Nq.players[KP].weapon[KV] = Ks.ply[KP].weapon[KV];
                        continue;
                    }
                    Nq.players[KP][Kt] = Ks.ply[KP][Kt];
                }
            }
            for (let Kj in Nq.mobs)
                Nq.mobs[Kj].hide = !![];
            for (let Kc in Ks.mobs) {
                let Kq = Nq.mobs[Kc];
                if (Kq == null)
                    continue;
                Kq.hide = ![];
                Kq.lastX = xI(Kq);
                Kq.lastY = xa(Kq);
                Kq.lastServerX = Kq.x;
                Kq.lastServerY = Kq.y;
                Kq.lastAngle = xi(Kq);
                for (let Kb in Ks.mobs[Kc]) {
                    Kq[Kb] = Ks.mobs[Kc][Kb];
                }
                Kq.angle = Kq.rotation;
            }
            xP();
            Nq.updatePlayerData = Ks;
            U.handleLevel(Ks.lvl);
        }
        );
        ((async () => {
            let KW = await fetch(getAPIurl() + '/api/login', {
                'method': 'POST',
                'credentials': 'include',
                'headers': {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
            let KB = await KW.json();
            if (KB.loginSuccess) {
                localStorage.setItem('accUsername', KB.u);
                localStorage.setItem('accSSID', KB.s);
                f();
                Nq.loggedin = !![];
            }
        }
        )());
    }
    function xI(Ky, KK, KO, Ku, KW=Nq.updatePlayerData.time) {
        if (!KO && Math.abs(Ky.x - Ky.lastX) > 200)
            return Ky.x;
        if (Ku == null)
            Ku = Date.now();
        let KB = (Ku - KW) / 50;
        if (KB > 1.5)
            KB = 1.5;
        let Kl = Math.round(KB * (Ky.x - Ky.lastX) + Ky.lastX);
        if (KB < 1 || !KK) {
            return Kl;
        } else {
            return Kl;
        }
    }
    function xa(Ky, KK, KO, Ku, KW=Nq.updatePlayerData.time) {
        if (!KO && Math.abs(Ky.y - Ky.lastY) > 240)
            return Ky.y;
        if (Ku == null)
            Ku = Date.now();
        let KB = (Ku - KW) / 50;
        if (KB > 1.5)
            KB = 1.5;
        let Kl = Math.round(KB * (Ky.y - Ky.lastY) + Ky.lastY);
        if (KB < 1 || !KK) {
            return Kl;
        } else {
            return Kl;
        }
    }
    function xG(Ky, KK) {
        let KO = 360;
        let Ku = (KK - Ky) % KO;
        return 2 * Ku % KO - Ku;
    }
    function xi(Ky) {
        let KK = (Date.now() - Nq.updatePlayerData.time) / 50;
        if (KK > 1.5)
            KK = 1.5;
        return xf(KK * xG(Ky.lastAngle, Ky.angle) + Ky.lastAngle, 360);
    }
    function xN(Ky) {
        return './images/skins/' + Ky + '.svg';
    }
    ;window.changeFilter = function() {
        Nq.filter = Nq.filters[(Nq.filter.pos + 1) % Nq.filters.length];
        NQ.style.filter = 'hue-rotate(' + Nq.filter.hue + 'deg)';
        let Ky = document.querySelector(':root');
        Ky.style.setProperty('--bgtop', Nq.filter.bgtop);
    }
    ;
    window.toggleWeapons = function() {
        Nq.showWeaponMenu = !Nq.showWeaponMenu;
        let Ky = Nq.showWeaponMenu ? 'visible' : 'hidden';
        let KK = Nq.showWeaponMenu ? 'Hide Evolutions' : 'Show Evolutions';
        document.getElementById('inner').style.visibility = Ky;
        document.getElementById('weaponHideButton').innerHTML = KK;
    }
    ;
    window.keybind = function(Ky) {
        Nq.awaitKeybind = Ky;
    }
    ;
    window.resetKeybinds = function() {
        for (let Ky in Nq._keys) {
            let KK = Nq._keys[Ky];
            Nq.keys[Ky] = KK;
            localStorage.setItem('keybind' + Ky, KK);
            if (KK == ' ')
                KK = 'Spacebar';
            document.getElementById('keybind' + Ky).innerHTML = KK;
        }
    }
    ;
    window.closeStatusBox = function() {
        document.getElementById('statusbox').style.visibility = 'hidden';
    }
    ;
    function xx(Ky) {
        let KK = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        let KO = new XMLHttpRequest();
        KO.onreadystatechange = function() {
            if (KO.readyState == XMLHttpRequest.DONE)
                Ky(KO.status === 0 || KO.responseURL !== KK);
        }
        ;
        KO.open('HEAD', KK, !![]);
        KO.send(null);
    }
    window.showAD = async function(Ky, KK) {
        aiptag.cmd.display.push(function() {
            aipDisplayTag.display(Ky);
        });
        Ky.style.display = 'flex';
        xx(KO => {
            if (KO) {
                i(Ky).classList.add('erth2-party');
            } else {
                i(Ky).classList.remove('erth2-party');
            }
        }
        );
    }
    ;
    window.hideAD = function(Ky) {
        i(Ky).style.display = 'none';
        aiptag.cmd.display.push(function() {
            aipDisplayTag.destroy(Ky);
        });
    }
    ;
    window.hideADs = function() {
        hideAD('realmz-io_970x250');
    }
    ;
    window.changeBG = function(Ky) {
        let KK = Object.keys(Nq.background.colors);
        let KO = (Nq.background.type + 1) % (KK.length - 1);
        if (Ky != null)
            KO = Ky;
        Nq.background.src = KK[KO];
        Nq.background.type = KO;
        if (Ky != null)
            return;
        localStorage.setItem('settingsBACKGROUNDTYPE', KO);
        localStorage.setItem('settingsBACKGROUNDSRC', KK[KO]);
    }
    ;
    window.chgs = function(Ky) {
        Nq.settings[Ky] = !Nq.settings[Ky];
        localStorage.setItem('settings' + Ky, Nq.settings[Ky]);
    }
    ;
    window.setsettings = function(Ky, KK) {
        Nq.settings[Ky] = Number(KK);
        localStorage.setItem('settings' + Ky, Nq.settings[Ky]);
        if (Ky === 'musicVolume')
            P.changeMusicVolume();
    }
    ;
    window.settings = function() {
        Nq.settingsOpen = !Nq.settingsOpen;
        if (Nq.settingsOpen) {
            document.getElementById('settingsbox').style.visibility = 'visible';
        } else {
            document.getElementById('settingsbox').style.visibility = 'hidden';
        }
    }
    ;
    window.hideupgrades = function() {
        Nq.upgradesOpen = !Nq.upgradesOpen;
        if (Nq.upgradesOpen) {
            document.getElementById('gameInfoMenu').style.visibility = 'visible';
            if (Nq.mobile)
                document.getElementById('mobile').style.visibility = 'hidden';
            document.getElementById('gameInfoMenu').style.height = '';
            document.getElementById('upgradecount').style.visibility = 'visible';
            document.getElementById('upgradecount').style.height = '';
        } else {
            document.getElementById('gameInfoMenu').style.visibility = 'hidden';
            if (Nq.mobile)
                document.getElementById('mobile').style.visibility = 'visible';
            document.getElementById('gameInfoMenu').style.height = '0px';
            document.getElementById('upgradecount').style.visibility = 'hidden';
            document.getElementById('upgradecount').style.height = '0px';
        }
    }
    ;
    window.help = function() {
        Nq.helpOpen = !Nq.helpOpen;
        if (Nq.helpOpen) {
            document.getElementById('help').style.visibility = 'visible';
        } else {
            document.getElementById('help').style.visibility = 'hidden';
        }
    }
    ;
    function xy() {
        let Ky = 0;
        function KK(KO) {
            Nq.servers = KO;
            if (Nq.ingame)
                return;
            let Ku = Date.now();
            if (Ku - 2000 < Ky)
                return;
            xZ();
            Ky = Ku;
        }
        return KK;
    }
    Ng.on('updateServers', xy());
    const xK = {
        'NA_1': {
            'title': 'Main Realm',
            'description': 'Free for all: Explore the world, fight bosses, complete missions, and push the leaderboard.',
            'image': './images/FFA_PAGE.png'
        },
        'Arena': {
            'title': 'Arena',
            'description': 'Minigames: fight in 1v1 arenas, group PvP arenas, and other minigames',
            'image': './images/ARENA_PAGE.png'
        }
    };
    const xO = ['./bgs/realm.png', './bgs/forest.png', './bgs/plateau.png', './bgs/spires.png'];
    function xu(Ky, KK) {
        if (xK[Ky] != null)
            return xK[Ky];
        return {
            'title': 'Realm Server',
            'description': 'Join this realm for live multiplayer battles and exploration.',
            'image': xO[KK % xO.length]
        };
    }
    function xW(Ky) {
        let KK = document.getElementById('serverSelect');
        if (KK == null)
            return;
        let KO = Ky;
        let Ku = ![];
        if (KO == 'ADD_CUSTOM_SERVER') {
            let Kl = prompt('Enter server name:');
            let Ks = prompt('Enter server address:');
            if (Ks == null)
                return;
            Nq.otherServers[Kl] = {
                'url': Ks
            };
            return;
        }
        console.log('Connecting to: ' + KO);
        if (Ku) {
            xv(Nq.otherServers[KO].url, []);
            return;
        }
        let KW = Nq.servers[KO].url;
        let KB = Nq.servers[KO].info.id;
        xv(KW, [KB]);
    }
    function xB(Ky, KK) {
        let KO = xu(Ky.id, KK);
        let Ku = document.createElement('button');
        Ku.type = 'button';
        Ku.className = 'server-card';
        Ku.setAttribute('data-server-id', Ky.id);
        let KW = document.createElement('div');
        KW.className = 'server-card-overlay';
        let KB = document.createElement('p');
        KB.className = 'server-card-title';
        KB.innerText = KO.title;
        let Kl = document.createElement('p');
        Kl.className = 'server-card-name';
        Kl.innerText = Ky.name;
        let Ks = document.createElement('p');
        Ks.className = 'server-card-count';
        Ks.innerText = Ky.players + ' player' + (Ky.players == 1 ? '' : 's');
        let KZ = document.createElement('p');
        KZ.className = 'server-card-description';
        KZ.innerText = KO.description;
        KW.appendChild(KB);
        KW.appendChild(Kl);
        KW.appendChild(Ks);
        KW.appendChild(KZ);
        Ku.appendChild(KW);
        xl(Ku, Ky, KK);
        Ku.onclick = () => xW(Ky.id);
        return Ku;
    }
    function xl(Ky, KK, KO) {
        let Ku = xu(KK.id, KO);
        Ky.style.backgroundImage = 'url(\'' + gameAsset(Ku.image) + '\x27)';
        Ky.onclick = () => xW(KK.id);
        Ky.classList.toggle('selected', Nq.connectedserver == KK.id);
        Ky.setAttribute('aria-pressed', Nq.connectedserver == KK.id ? 'true' : 'false');
        Ky.querySelector('.server-card-title').innerText = Ku.title;
        Ky.querySelector('.server-card-name').innerText = 'Server: ' + KK.name;
        Ky.querySelector('.server-card-count').innerText = KK.players + ' player' + (KK.players == 1 ? '' : 's');
        Ky.querySelector('.server-card-description').innerText = Ku.description;
    }
    function xs(Ky) {
        let KK = document.getElementById('serverCards');
        if (KK == null)
            return;
        let KO = {};
        for (let KW = KK.children.length - 1; KW >= 0; KW--) {
            let KB = KK.children[KW];
            let Kl = KB.getAttribute('data-server-id');
            if (Kl == null) {
                KB.remove();
            } else {
                KO[Kl] = KB;
            }
        }
        let Ku = {};
        for (let Ks = 0; Ks < Ky.length; Ks++) {
            let KZ = Ky[Ks];
            let Kp = KO[KZ.id];
            Ku[KZ.id] = !![];
            if (Kp == null) {
                Kp = xB(KZ, Ks);
                KK.appendChild(Kp);
            } else {
                xl(Kp, KZ, Ks);
            }
        }
        for (let Kh in KO) {
            if (!Ku[Kh]) {
                KO[Kh].remove();
            }
        }
    }
    function xZ() {
        let Ky = document.getElementById('serverSelect');
        let KK = Nq.servers;
        Ky.innerHTML = '';
        let KO = [];
        for (let Ku in KK) {
            let KW = document.createElement('option');
            let KB = KK[Ku].info?.players ?? 0;
            KW.innerHTML = 'Server: ' + Ku + ' - Online: ' + KB + '/100';
            KW.setAttribute('value', Ku);
            if (Nq.connectedserver == Ku) {
                KW.setAttribute('selected', !![]);
            }
            Ky.appendChild(KW);
            KO.push({
                'id': Ku,
                'name': KK[Ku].info?.id ?? Ku,
                'players': KB
            });
        }
        for (let Kl in Nq.otherServers) {
            let Ks = document.createElement('option');
            Ks.innerHTML = Kl + ' - ' + Nq.otherServers[Kl].url;
            Ks.setAttribute('value', Kl);
            Ks.setAttribute('external', !![]);
            if (Nq.connectedserver == Kl) {
                Ks.setAttribute('selected', !![]);
            }
            Ky.appendChild(Ks);
            KO.push({
                'id': Kl,
                'name': Kl,
                'players': 0
            });
        }
        if (Nq.connectedserver == null) {
            let KZ = document.createElement('option');
            KZ.innerHTML = 'No selection';
            KZ.setAttribute('selected', !![]);
            Ky.appendChild(KZ);
        }
        xs(KO);
    }
    function xp() {
        let Ky = document.getElementById('serverSelect');
        let KK = document.createElement('option');
        KK.setAttribute('value', 'ADD_CUSTOM_SERVER');
        KK.innerHTML = 'Add server...';
        Ky.appendChild(KK);
    }
    xp();
    xh();
    function xh() {
        Nq.camera.panX = 1000 + Math.round(Math.random() * 3000);
        Nq.camera.panY = 1000 + Math.round(Math.random() * 100);
        Nq.panDir = 45;
    }
    function xg(Ky) {
        Nq.ping = Date.now() - Ky;
        setTimeout( () => {
            Ng.emit('ping', Date.now());
            Nq.sentPing = Date.now();
        }
        , 800);
    }
    Ng.on('ping', xg);
    function xr(Ky) {
        let KK = Ng._callbacks;
        Ng.close();
        Ng = io({
            'transports': ['websocket'],
            'protocols': Ky
        });
        Ng._callbacks = KK;
        Nq.connectedserver = Ky[0];
        document.getElementById('serverSelect').name = Ky[0];
    }
    function xD(Ky) {
        xQ(Ky);
    }
    Ng.on('particle', xD);
    Ng.on('weather', Ky => {
        Nq.weatherManager.setWeather(Ky);
    }
    );
    Ng.bin(7, Ky => {
        let KK = Ky[1];
        let KO = Ky[2];
        let Ku = Ky[3];
        let KW = Nq.updatePlayerData.player.x;
        let KB = Nq.updatePlayerData.player.y;
        if (KK != 0)
            xQ({
                'x': KW + Math.round(Math.random() * 20),
                'y': KB + Math.round(Math.random() * 20) - 30,
                'type': 'text',
                'c': '#db5757',
                'text': '-' + KK,
                'outline': '#8c2121',
                'time': 1300
            });
        if (Ku != 0)
            xQ({
                'x': KW + Math.round(Math.random() * 20),
                'y': KB + Math.round(Math.random() * 20) - 30,
                'type': 'text',
                'c': '#10d110',
                'text': '+' + Ku,
                'outline': '#0b820b',
                'time': 1300
            });
    }
    );
    function xQ(Ky) {
        Nq.particles.push({
            'start': Date.now(),
            'seed': Math.random(),
            ...Ky
        });
    }
    const xM = 'realmz-tutorial-attack-complete';
    function xY() {
        const Ky = Nq.tutorial;
        if (Ky != null) {
            const KK = Nq.mobs[Ky.mobId];
            if (KK != null) {
                KK.focus = ![];
                KK.focusType = null;
            }
        }
        for (const KO in Nq.players) {
            const Ku = Nq.players[KO];
            if (Ku.focusType === 'controls1') {
                Ku.focus = ![];
                Ku.focusType = null;
            }
        }
        Nq.tutorial = null;
        localStorage.setItem(xM, 'true');
    }
    function xX() {
        if (Nq.tutorial == null || Nq.tutorial.movedAt != null)
            return;
        Nq.tutorial.movedAt = Date.now();
    }
    function xE() {
        if (Nq.tutorial == null || Nq.tutorial.firstAttackAt != null)
            return;
        Nq.tutorial.firstAttackAt = Date.now();
    }
    Ng.on('tutorialComplete', xY);
    function xv(Ky, KK) {
        log('Switching..');
        Ng.offBin(0);
        z.open('Switching servers...');
        log('switching' + KK);
        Ng['switch'](Ky, [...KK, yn()]);
        Nq.connectedserver = KK[0];
        document.getElementById('serverSelect').name = KK[0];
    }
    Ng.on('gamestate', (Ky, KK) => {
        Nq.gamestate[Ky] = KK;
    }
    );
    document.getElementById('serverSelect').onchange = () => {
        let Ky = document.getElementById('serverSelect');
        let KK = Ky.options[Ky.selectedIndex].value;
        let KO = Ky.options[Ky.selectedIndex].getAttribute('external');
        if (KK == 'ADD_CUSTOM_SERVER') {
            let KB = prompt('Enter server name:');
            let Kl = prompt('Enter server address:');
            if (Kl == null)
                return;
            Nq.otherServers[KB] = {
                'url': Kl
            };
            xZ();
            return;
        }
        log('Connecting to: ' + KK);
        if (KO) {
            xv(Nq.otherServers[KK].url, []);
            return;
        }
        let Ku = Nq.servers[KK].url;
        let KW = Nq.servers[KK].info.id;
        xv(Ku, [KW]);
    }
    ;
    window.onunload = () => {
        Ng.emit('u_close');
        Ng.close(1000);
    }
    ;
    window.fullscreen = function() {
        let Ky = document.documentElement;
        Ky.requestFullscreen();
    }
    ;
    Ng.on('open', (Ky, KK=!![]) => {
        Ng.emitBinary(new Uint8Array([70, 12, 41, 251, 2]));
        Nq.createdConnection = !![];
        console.log('opened');
        Nq.flowerQueue = [];
        Nq.ready.map = ![];
        Ng.emit('login.', localStorage.getItem('accUsername'), localStorage.getItem('accSSID'));
        Ng.emit('ping', Date.now());
        Ng.emit('load', !![]);
        if (Nq.ingame && KK) {
            console.log('autojoin');
            Ng.emit('joinGame​', {
                'name': Nq.name,
                'analytics': U.getJoinMetadata()
            });
        }
        ((async () => {
            xx(KO => {
                console.log(KO);
                Ng.emit('client', 'adblock', KO);
            }
            );
        }
        )());
    }
    );
    function xe() {
        for (let Ky = 0; Ky < 100; Ky++) {
            let KK = new F(null,['none']);
            KK.on('open', () => {
                KK.emit('joinGame​', {
                    'name': Ky + ''
                });
            }
            );
        }
        return !![];
    }
    Ng.on('error', (Ky, KK, KO, Ku, KW) => {
        Ng.offBin(0);
        log('websocket error!!');
        log(Ky);
        log(KK);
        log(KO);
        log(Ku);
        log(KW);
    }
    );
    Ng.on('close', Ky => {
        Nr.close();
        Ng.offBin(0);
        log('connection closed: ' + Ky.code + ' ' + Ky.reason);
        z.open('Reconnecting...');
        if (!Nq.createdConnection)
            return;
        if (Ky.code !== 1006 && Ky.code !== 3333)
            return;
        let KK = Date.now();
        setTimeout( () => {
            Ng._setupSocket(null, [Nq.connectedserver], {
                'open': () => {
                    log('reconnecting...');
                    if (Nq.ingame && Date.now() - KK < 20000) {
                        Ng.emit('joinGame​', {
                            'name': Nq.name,
                            'uuid': Nq.uuid,
                            'reconnectToken': Nq.reconnectToken,
                            'analytics': U.getJoinMetadata()
                        });
                        Nq.ingame = !![];
                    }
                }
                ,
                'join': ![]
            });
        }
        , 500);
        return;
    }
    );
    function xL(Ky) {
        let KK = 2166136261;
        for (let KO = 0; KO < Ky.length; KO++) {
            KK ^= Ky.charCodeAt(KO);
            KK = Math.imul(KK, 16777619);
        }
        return KK >>> 0;
    }
    function xS(Ky) {
        let KK = 2166136261;
        for (const KO of Ky) {
            KK ^= KO;
            KK = Math.imul(KK, 16777619);
        }
        return KK >>> 0;
    }
    function xA(Ky, KK) {
        return K1(xL(String(Ky) + ':' + KK + ':json-byte-packet'));
    }
    function xk(Ky, KK, KO='') {
        const Ku = JSON.stringify(Ky);
        const KW = new TextEncoder().encode(Ku);
        const KB = xA(KK, KO);
        const Kl = [];
        const Ks = KW.length;
        const KZ = xS(KW);
        Kl.push(Ks >>> 24 & 255, Ks >>> 16 & 255, Ks >>> 8 & 255, Ks & 255, KZ >>> 24 & 255, KZ >>> 16 & 255, KZ >>> 8 & 255, KZ & 255);
        for (const Kp of KW) {
            const Kh = Math.floor(KB() * 256);
            Kl.push(Kp ^ Kh);
            const Kg = Math.floor(KB() * 3);
            for (let Kr = 0; Kr < Kg; Kr++) {
                Kl.push(Math.floor(KB() * 256));
            }
        }
        return new Uint8Array(Kl);
    }
    function xo(Ky) {
        let KK = Ky[1];
        Nq.mobs[Ky[0]] = {
            'x': 0,
            'y': 0,
            'lastX': 0,
            'lastY': 0,
            'interpolatedX': 0,
            'interpolatedY': 0,
            'hide': !![],
            'sz': Nq.mobData[KK].size,
            'type': Nq.mobData[KK].renderId,
            'id': KK,
            'col': Nq.mobData[KK].color,
            'facing': 1,
            'hp': 100,
            'angle': 0,
            'lastAngle': 0,
            'rand': Math.random(),
            'rotation': 0
        };
    }
    Ng.on('focus', (Ky, KK, KO) => {
        if ((KO === 'tutorial' || KO === 'controls1') && localStorage.getItem(xM) === 'true')
            return;
        let Ku;
        if (Ky === 'player' || Ky === 'p') {
            Ku = Nq.players;
        } else if (Ky === 'mob' || Ky === 'm') {
            Ku = Nq.mobs;
        } else {
            return;
        }
        const KW = Ku[KK];
        if (KW == null)
            return;
        if (KO === 'tutorial') {
            Nq.tutorial = {
                'mobId': KK,
                'movedAt': null,
                'firstAttackAt': null
            };
            KW.maxHp = 10;
        }
        KW.focus = !![];
        KW.focusType = KO;
    }
    );
    Ng.on('m', Ky => {
        let KK = Ky[0];
        let KO = Ky[1];
        if (KK == 0) {
            xo([KO, Ky[2]]);
        }
        if (KK == 1) {
            delete Nq.mobs[KO];
        }
        if (KK == 2) {
            if (Ky[2] == 'type') {
                Nq.mobs[KO].type = Nq.mobData[Ky[3]].renderId;
                Nq.mobs[KO].id = Ky[3];
                return;
            }
            Nq.mobs[KO][Ky[2]] = Ky[3];
        }
    }
    );
    function xT(Ky) {
        Ky.lastX = 0;
        Ky.lastY = 0;
        Ky.lastServerX = 0;
        Ky.lastServerY = 0;
        Ky.interpolatedX = 0;
        Ky.interpolatedY = 0;
        Ky.weapon.lastX = 0;
        Ky.weapon.lastY = 0;
        Ky.weapon.lastServerX = 0;
        Ky.weapon.lastServerY = 0;
        Ky.weapon.lastAngle = 0;
        Ky.hide = !![];
        Ky.handY = 0;
    }
    Ng.on('init', (Ky, KK, KO, Ku, KW, KB, Kl, Ks) => {
        if (Nq.loadPerformance.socketInitEvent == null)
            Nq.loadPerformance.socketInitEvent = Date.now();
        try {
            z.close();
        } catch (Kp) {}
        Nq.connectedserver = KO;
        Nq.uuid = Ky.uuid;
        Nq.reconnectToken = Ky.reconnectToken;
        Nq.players = KW;
        Nq.items = [];
        for (let Kh in Ks) {
            Nz(Kh, Ks[Kh]);
        }
        for (let Kg in KW) {
            xT(KW[Kg]);
        }
        if (Nq.ready.files) {
            for (let Kr in Kl) {
                xo(Kl[Kr]);
            }
        } else {
            Nq.mobQueue = Kl;
        }
        Nq.bgeffect = null;
        Nq.trees = [];
        Ia = Ky.w;
        IG = Ky.h;
        if (Nq.loadPerformance.loadMap == null)
            Nq.loadPerformance.loadMap = Date.now();
        Nn(KK, Ky);
        console.log('Successfully connected to ' + KO + ' Gamemode: ' + KB);
        i('escapeScreenServerInfo').innerHTML = 'Server: ' + KO + ' - ' + KB;
        if (CLIENT_TYPE === 'v1') {
            switch (KB) {
            case 'CTF':
                i('nameplate').src = gameAsset('/images/ctfnameplate.png');
                break;
            default:
                i('nameplate').src = gameAsset('/images/realmz.png');
            }
        }
        let KZ = document.querySelector(':root');
        if (KB === 'mirny') {
            if (localStorage.getItem('visited-mar-30-2023') == null) {}
            document.querySelector('#timer').style.visibility = 'visible';
            document.querySelector('#stageCounter').style.visibility = 'visible';
            Nc['./images/tree.png'].src = gameAsset('./images/mirny/mirnytree.png');
            Nc['./images/weapons.png'].src = gameAsset('./images/mirny/mirnyweapons.png');
            Nc['./images/snow_tiles1.png'].src = gameAsset('./images/mirny/msnow_tiles1.png');
            KZ.style.setProperty('--bgtop', '#4f4945');
            KZ.style.setProperty('--bgbottom', '#ada68a');
            changeBG(3);
        } else {
            if (Nq.gamemode == 'mirny') {
                Nc['./images/tree.png'].src = gameAsset('./images/tree.png');
                Nc['./images/weapons.png'].src = gameAsset('./images/weapons.png');
                Nc['./images/snow_tiles1.png'].src = gameAsset('./images/snow_tiles1.png');
                changeBG(localStorage.getItem('settingsBACKGROUNDTYPE'));
                KZ.style.setProperty('--bgtop', '#73A7FC');
                KZ.style.setProperty('--bgbottom', 'rgba(188,225,255,1)');
            }
        }
        if (KB == 'CTF') {
            document.querySelector('#timer').style.visibility = 'visible';
            document.querySelector('#stageCounter').style.visibility = 'visible';
        }
        xh();
        Nq.gamemode = KB;
    }
    );
    function xJ(Ky, KK, KO, Ku, KW, KB=[], Kl=58) {
        Nq.players[Ky] = {
            'x': KK,
            'y': KO,
            'icons': KB,
            'sz': Kl,
            'skin': KW,
            'persistent': !![],
            'msg': '',
            'lvl': 0,
            'hide': ![],
            'xp': 0,
            'name': Ku,
            'i': 0,
            'hp': 100,
            'facing': 1,
            'weapon': {}
        };
        xT(Nq.players[Ky]);
        Nq.players[Ky].hide = ![];
    }
    Ng.on('updatePlayer', (Ky, KK, KO, Ku) => {
        if (Ky == 'delete') {
            delete Nq.players[KK];
        } else if (Ky == 'update') {
            for (let KW in KO) {
                Nq.players[KK][KW] = KO[KW];
                if (KW == 'weapon') {
                    Nq.players[KK][KW].lastX = 0;
                    Nq.players[KK][KW].lastY = 0;
                    Nq.players[KK][KW].lastServerX = 0;
                    Nq.players[KK][KW].lastServerY = 0;
                    Nq.players[KK][KW].lastAngle = 0;
                }
            }
        } else if (Ky == 'add') {
            KO.npc = Ku;
            Nq.players[KK] = KO;
            xT(Nq.players[KK]);
        }
    }
    );
    function xd(Ky) {
        let KK = x8;
        let KO = xw(Ky.slice(1, 1 + KK));
        Nq.map[KO].flowers[Ky[1 + KK]] = {
            't': Ky[KK + 2],
            'off': Ky[KK + 3],
            'f': Math.round(Math.random()),
            'sf': 0.8 + Math.round(Math.random() * 4) / 10
        };
    }
    function xw(Ky) {
        let KK = '';
        for (let KO of Ky)
            KK += '0'.repeat(8 - KO.toString(2).length) + KO.toString(2);
        return parseInt(KK, 2);
    }
    Ng.bin(1, Ky => {
        if (!Nq.ready.map) {
            Nq.flowerQueue.push(Ky);
            return;
        }
        xd(Ky);
    }
    );
    Ng.on('proj', Ky => {
        for (let KK in Ky) {
            let KO = Ky[KK];
            Nq.projectiles[KO.id] = {
                'id': KO.id,
                'x': KO.x,
                'y': KO.y,
                't': KO.t ?? 'proj_arrow',
                'r': KO.r,
                'a': KO.a,
                'dS': KO.dS ?? 0,
                'dV': KO.dV ?? 1,
                'vX': KO.vX,
                'vY': KO.vY,
                'lastX': KO.x,
                'lastY': KO.y,
                'c': KO.color ?? '#000000',
                'g': KO.g ?? 0,
                'maxg': KO.maxg ?? 16,
                'air': KO.air ?? 0
            };
        }
    }
    );
    Ng.on('orbProj', Ky => {
        let KK = Nq.players[Ky.id];
        if (KK && KK.weapon)
            KK.weapon.circulatingProjectiles = Ky.list;
    }
    );
    Ng.on('uP', Ky => {
        for (let KK in Ky.data) {
            if (Ky.id in Nq.projectiles)
                Nq.projectiles[Ky.id][KK] = Ky.data[KK];
        }
    }
    );
    Ng.on('dP', Ky => {
        for (let KK in Ky) {
            delete Nq.projectiles[Ky[KK]];
        }
    }
    );
    function xP() {
        for (let Ky in Nq.projectiles) {
            let KK = Nq.projectiles[Ky];
            let KO = (Date.now() - Nq.updatePlayerData.time) / 50;
            if (KO > 2)
                KO = 2;
            KK.lastX = Math.round(KO * (KK.x - KK.lastX) + KK.lastX);
            KK.lastY = Math.round(KO * (KK.y - KK.lastY) + KK.lastY);
            xt(KK);
            xt(KK);
        }
    }
    function xH(Ky) {
        let KK = (Date.now() - Nq.updatePlayerData.time) / 50;
        if (KK > 2)
            KK = 2;
        return {
            'id': Ky.id,
            'x': Math.round(KK * (Ky.x - Ky.lastX) + Ky.lastX),
            'y': Math.round(KK * (Ky.y - Ky.lastY) + Ky.lastY),
            't': Ky.t,
            'r': Ky.r,
            'a': Ky.a,
            'dS': Ky.dS,
            'dV': Ky.dV,
            'vX': Ky.vX,
            'vY': Ky.vY,
            'c': Ky.c,
            'g': Ky.g,
            'maxg': Ky.maxg,
            'air': Ky.air
        };
    }
    function xt(Ky) {
        let KK = Ky.x;
        let KO = Ky.y;
        if (Ky.g != 0) {
            if (Ky.vY < Ky.maxg) {
                Ky.vY += Ky.g;
            }
        }
        if (Ky.air != 0) {
            if (Math.abs(Ky.vX) > 0)
                Ky.vX -= Math.abs(Ky.vX / Ky.air) * Math.sign(Ky.vX);
            if (Math.abs(Ky.vX) < 0)
                Ky.vX = 0;
        }
        Ky.x += Ky.vX;
        Ky.y += Ky.vY;
        Ky.a = iX(Ky.x, Ky.y, KK, KO).angle;
        Ky.r += Ky.dS;
        if (Ky.r > 400)
            Ky.r = 400;
        Ky.vX *= Ky.dV;
        Ky.vY *= Ky.dV;
    }
    document.addEventListener('mousedown', Ky => {
        let KK = Ky.target.getAttribute('type');
        if (KK == 'closeWindow') {
            let KO = Ky.target.getAttribute('target');
            i(KO).style.visibility = 'hidden';
        }
        if (KK == 'dragWindow') {
            if (N.active != null)
                return;
            N.active = Ky.target.getAttribute('target');
        }
    }
    );
    document.addEventListener('mouseup', () => {
        N.active = null;
    }
    );
    if (window.matchMedia('(pointer: coarse)').matches) {
        xj();
    } else {
        NQ.addEventListener('mousedown', Ky => {
            if (!Ky[ND])
                return;
            if (Ky.button == 2)
                return;
            xR(Ky.clientX, Ky.clientY);
            y1();
        }
        );
        NQ.addEventListener('mouseup', Ky => {
            if (!Ky.isTrusted)
                return;
            if (Nq.autoattack)
                return;
            y2();
        }
        );
    }
    function xV() {}
    function xj() {
        Nq.mobile = !![];
        let Ky = document.getElementById('mobile');
        const KK = {};
        function KO(KB, Kl) {
            if (!!KK[KB] === Kl)
                return;
            KK[KB] = Kl;
            if (Kl) {
                y4(KB, 1);
            } else {
                y4(KB, 0);
                delete KK[KB];
            }
        }
        function Ku(KB) {
            const Kl = KB?.getAttribute('z') || '';
            const Ks = {
                'a': ![],
                'd': ![],
                'w': ![],
                'i': ![],
                ' ': ![]
            };
            switch (Kl) {
            case 'leftup':
                Ks.a = !![];
                Ks.w = !![];
                break;
            case 'rightup':
                Ks.d = !![];
                Ks.w = !![];
                break;
            case 'left':
                Ks.a = !![];
                break;
            case 'right':
                Ks.d = !![];
                break;
            case 'up':
                Ks.w = !![];
                break;
            case 'stealth':
                Ks.i = !![];
                break;
            case 'dash':
                Ks[' '] = !![];
                break;
            case 'attack':
                y0();
                break;
            }
            for (const KZ in Ks) {
                KO(KZ, Ks[KZ]);
            }
        }
        Ky.addEventListener('touchmove', KB => {
            const Kl = KB.touches[0];
            const Ks = document.elementFromPoint(Kl.clientX, Kl.clientY);
            Ku(Ks);
        }
        );
        Ky.addEventListener('touchstart', KB => {
            Ku(KB.target);
        }
        );
        Ky.addEventListener('touchend', KB => {
            for (let Ks in KK) {
                y4(Ks, 0);
                delete KK[Ks];
            }
            return;
            let Kl = KB.target.getAttribute('z');
            switch (Kl) {
            case 'left':
                y4('a', 0);
                break;
            case 'right':
                y4('d', 0);
                break;
            case 'up':
                y4('w', 0);
                break;
            case 'dash':
                y4(' ', 0);
                break;
            case 'leftup':
                y4('a', 0);
                y4('w', 0);
                break;
            case 'rightup':
                y4('d', 0);
                y4('w', 0);
                break;
            }
        }
        );
        NQ.addEventListener('touchstart', KB => {
            xR(KB.touches[KB.touches.length - 1].pageX, KB.touches[KB.touches.length - 1].pageY);
            y1();
        }
        );
        NQ.addEventListener('touchend', KB => {
            if (Nq.autoattack)
                return;
            y2();
        }
        );
        return;
        const KW = {
            'canvas': document.getElementById('joystick'),
            'ctx': document.getElementById('joystick').getContext('2d'),
            'active': {},
            'innerRadius': 40,
            'draw': function(KB, Kl) {
                let Ks = KW.ctx;
                Ks.fillStyle = 'rgba(100, 100, 100, 0.7)';
                Ks.strokeStyle = 'gray';
                Ks.clearRect(0, 0, KW.canvas.width, KW.canvas.height);
                Ks.beginPath();
                Ks.arc(150, 150, 100, 0, Math.PI * 2);
                Ks.fill();
                Ks.beginPath();
                Ks.arc(150, 150, KW.innerRadius, 0, Math.PI * 2);
                Ks.stroke();
                Ks.fillStyle = 'rgba(255, 255, 255, 0.5)';
                Ks.beginPath();
                Ks.arc(KB + 150, Kl + 150, 70, 0, Math.PI * 2);
                Ks.fill();
            },
            'touch'(KB) {
                let Kl = KW.canvas.width / KW.canvas.offsetWidth;
                let Ks = Kl * (KB.touches[0].clientX - (KW.canvas.offsetLeft + KW.canvas.offsetWidth / 2));
                let KZ = Kl * (KB.touches[0].clientY - (KW.canvas.offsetTop + KW.canvas.offsetHeight / 2));
                Ks = x0(Ks, -75, 75);
                KZ = x0(KZ, -75, 75);
                let Kp = Math.round(Math.atan2(-KZ, -Ks) * 180 / Math.PI);
                let Kh = Math.hypot(Ks, KZ);
                if (Kh < KW.innerRadius) {
                    KW.endtouch();
                    KW.draw(Ks, KZ);
                    return;
                }
                let Kg = [];
                for (let KD in KW.active) {
                    KW.active[KD] = ![];
                }
                let Kr = 20;
                if (Kp > -45 - Kr && Kp < 45 + Kr)
                    Kg.push('a');
                if (Kp > 45 - Kr && Kp < 135 + Kr)
                    Kg.push('w');
                if (Kp > 135 - Kr || Kp < -135 + Kr)
                    Kg.push('d');
                for (let KQ = 0; KQ < Kg.length; KQ++) {
                    let KM = Kg[KQ];
                    if (!(KM in KW.active)) {
                        y4(KM, 1);
                    }
                    KW.active[KM] = !![];
                }
                for (let KY in KW.active) {
                    if (KW.active[KY] === ![]) {
                        y4(KY, 0);
                        delete KW.active[KY];
                    }
                }
                KW.draw(Ks, KZ);
            },
            'endtouch'() {
                for (let KB in KW.active) {
                    y4(KB, 0);
                    delete KW.active[KB];
                }
                KW.draw(0, 0);
            }
        };
        KW.draw(0, 0);
        KW.canvas.addEventListener('touchstart', KW.touch);
        KW.canvas.addEventListener('touchend', KW.endtouch);
        KW.canvas.addEventListener('touchcancel', KW.endtouch);
        KW.canvas.addEventListener('touchmove', KW.touch);
    }
    window.onbeforeunload = function() {
        if (Nq.ingame)
            return 'Data will be lost if you leave the page, are you sure?';
    }
    ;
    window.addEventListener('pagehide', Nb);
    function xc() {
        let Ky = window.devicePixelRatio;
        if (Ky >= 2) {
            Ky = Math.min(Ky, 1.5);
        } else {
            Ky = Math.min(Ky, 1);
        }
        i('guiCanvas').width = Math.round(window.innerWidth * Ky);
        i('guiCanvas').height = 120;
        let KK = 1;
        if (Nq.texturePack == 'pixelated') {
            NQ.style.imageRendering = 'pixelated';
            i('shadowCanvas').style.imageRendering = 'pixelated';
            NM.imageSmoothingEnabled = ![];
            KK = 4;
        }
        let KO = 1;
        let Ku = Math.round(KO * window.innerWidth * Ky / KK);
        if (Ku > 1920)
            Ku = 1920;
        let KW = Math.round(KO * window.innerHeight * Ky / KK);
        if (KW > 1080)
            KW = 1080;
        NQ.width = Ku;
        NQ.height = KW;
        i('shadowCanvas').width = Math.round(Ku / 2);
        i('shadowCanvas').height = Math.round(KW / 2);
        if (Nq.settings.highdetail) {
            NM.imageSmoothingEnabled = !![];
        } else {
            NM.imageSmoothingEnabled = ![];
        }
        NM.textRendering = 'optimizeSpeed';
    }
    window.nextTutorialSlide = (( () => {
        let Ky = 0;
        let KK = ![];
        return () => {
            if (Ky == 0 && !KK) {
                for (let Ku = 1; Ku <= 5; Ku++) {
                    let KW = new Image();
                    KW.src = gameAsset('./images/tutorial/slideshow' + Ku + '.png');
                }
                KK = !![];
            }
            if (Ky == 4) {
                i('slideShowContainer').style.visibility = 'hidden';
            }
            Ky = (Ky + 1) % 5;
            let KO = document.querySelector('#slideShowContainer div.window-top p.window-title');
            KO.innerHTML = 'Tutorial (' + (Ky + 1) + '/5) - Click to next slide';
            i('slideshowimage').src = gameAsset('./images/tutorial/slideshow' + (Ky + 1) + '.png');
        }
        ;
    }
    )());
    function xq() {
        Nq.videoMode = !Nq.videoMode;
        if (Nq.videoMode) {
            i('count').style.visibility = 'hidden';
            i('lb').style.visibility = 'hidden';
            i('upgradecounttoggle').style.visibility = 'hidden';
            i('fullscreen').style.visibility = 'hidden';
            i('minimap').style.visibility = 'hidden';
            i('mapname').style.visibility = 'hidden';
        } else {
            i('count').style.visibility = 'visible';
            i('lb').style.visibility = 'visible';
            i('upgradecounttoggle').style.visibility = 'visible';
            i('fullscreen').style.visibility = 'visible';
            i('minimap').style.visibility = 'visible';
            i('mapname').style.visibility = 'visible';
        }
    }
    window.toggleEscapeScreen = (( () => {
        let Ky = ![];
        return () => {
            if (Ky) {
                i('escapeScreen').style.visibility = 'hidden';
            } else {
                i('escapeScreen').style.visibility = 'visible';
            }
            Ky = !Ky;
        }
        ;
    }
    )());
    Ng.on('sound', (Ky, KK, KO) => {
        let Ku = Nq.updatePlayerData.player.x;
        let KW = Nq.updatePlayerData.player.y;
        let KB = Math.hypot(KO.x - Ku, KO.y - KW);
        let Kl = x0((KO.x - Ku) / 500, -1, 1);
        KK *= x0(1 / (KB / 400 + 0.4), 0, 1);
        P.playSound(Ky, KK * Nq.settings.soundVolume / 100, Kl);
    }
    );
    function xb(Ky, KK, KO) {
        let Ku = KK ? 'visible' : 'hidden';
        i('notification_' + Ky).style.visibility = Ku;
        if (KK == 0)
            KO = '';
        i('notification_' + Ky).innerHTML = KO;
    }
    let xF = [];
    let xU = ![];
    var xC = ![];
    document.addEventListener('keydown', Ky => {
        if (!Ky[ND])
            return;
        if (Ky.key == 'Escape') {
            toggleEscapeScreen();
        }
        if (Ky.ctrlKey && Ky.key == 'm')
            xq();
        if (Ky.key == '`') {
            if (i('console').style.visibility == 'visible') {
                Nq.DEBUG = ![];
                i('console').style.visibility = 'hidden';
            } else {
                Nq.DEBUG = !![];
                i('console').style.visibility = 'visible';
            }
        }
        if (Nq.awaitKeybind !== null) {
            Nq.keys[Nq.awaitKeybind] = Ky.key.toLowerCase();
            let KK = Ky.key.toLowerCase();
            if (KK == ' ')
                KK = 'Spacebar';
            document.getElementById('keybind' + Nq.awaitKeybind).innerHTML = KK;
            localStorage.setItem('keybind' + Nq.awaitKeybind, Ky.key.toLowerCase());
            Nq.awaitKeybind = null;
            return;
        }
        if (!Nq.ingame && !Nq.mobile && !Nq.deathscreen) {
            if (Ky.key === 'Enter') {
                const KO = document.getElementById('accountLoginPanel');
                Ky.preventDefault();
                if (KO?.classList.contains('open')) {
                    login();
                    return;
                }
                yy();
            }
            return;
        }
        if (Ky.key.toLowerCase() === 'enter' && ![]) {
            if (xC) {
                if (Nq.chatmsg == '/i') {}
                if (Nq.chatmsg == '/record') {
                    xF = new Array(Nq.map.length);
                    xF.fill({
                        'x': 0,
                        'y': 0
                    });
                }
                if (Nq.chatmsg == '/pause') {
                    xU = ![];
                }
                if (Nq.chatmsg == '/resume') {
                    xU = !![];
                }
                if (Nq.chatmsg == '/rot') {
                    Nq.updateRot = !![];
                    return;
                }
                Ng.emit('messag​e', {
                    'msg': Nq.chatmsg.substring(0, 70)
                });
                xC = ![];
                return 0;
            }
            Nq.chatmsg = '';
            xC = !![];
            return 0;
        }
        if (xC) {
            if (Ky.key == 'Backspace') {
                Nq.chatmsg = Nq.chatmsg.substring(0, Nq.chatmsg.length - 1);
                return 0;
            }
            if (Ky.key == 'Shift') {
                return 0;
            }
            if (Ky.key.length > 1)
                return;
            Nq.chatmsg += Ky.key;
            return;
        }
        if (Ky.key.toLowerCase() == 'y' || Ky.key == 'Tab') {
            Ky.preventDefault();
            N7.targetSize = 100;
            N7.startRender();
        }
        if (Ky.key.toLowerCase() === Nq.keys.autoattack) {
            if (!Nq.autoattack) {
                Nq.autoattack = !![];
                y1();
            } else {
                Nq.autoattack = ![];
                y2();
            }
            xb('auto', Nq.autoattack, 'Auto Attack Enabled - Toggle With ' + Nq.keys.autoattack);
            return;
        }
        if (Ky.key.toLowerCase() === Nq.keys.stealth) {
            if (Nq.stealthCooldown)
                return;
            Nq.stealthCooldown = !![];
            setTimeout( () => {
                Nq.stealthCooldown = ![];
            }
            , 300);
            y4('i', 1);
            Nq.stealth = !Nq.stealth;
            xb('stealth', Nq.stealth, 'Stealth Mode Enabled - Toggle With ' + Nq.keys.stealth + '/RMB');
            return;
        }
        if (Ky.key.toLowerCase() === Nq.keys.freeze) {
            Nq.freeze = !Nq.freeze;
            y4('p', 1);
            xb('frozen', Nq.freeze, 'Frozen - Toggle With ' + Nq.keys.freeze);
            return;
        }
        if (Ky.key.toLowerCase() === Nq.keys.attack) {
            y0();
            return;
        }
        if (Ky.key.toLowerCase() == Nq.keys.interact) {
            let Ku = Nq.updatePlayerData?.player;
            if (Ku == null)
                return;
            for (let KW in Nq.interactableAreas) {
                let KB = Nq.interactableAreas[KW];
                if (Math.hypot(KB.x - Ku.x, KB.y - Ku.y) < KB.r) {
                    xz(KW, KB);
                }
            }
        }
        if (Ky.key.toLowerCase() === Nq.keys.dash) {
            y4(' ', 1);
            return 0;
        }
        if (Nq.keys.left != 'a') {
            if (Ky.key.toLowerCase() == Nq.keys.left) {
                y4('a', 1);
                return;
            }
        }
        if (Nq.keys.right != 'd') {
            if (Ky.key.toLowerCase() == Nq.keys.right) {
                y4('d', 1);
                return;
            }
        }
        if (Nq.keys.jump != 'w') {
            if (Ky.key.toLowerCase() == Nq.keys.jump) {
                y4('w', 1);
                return;
            }
        }
        if (Ky.key == 'ArrowLeft') {
            y4('a', 1);
            return;
        }
        if (Ky.key == 'ArrowRight') {
            y4('d', 1);
            return;
        }
        if (Ky.key == 'ArrowUp') {
            y4('w', 1);
            return;
        }
        if (Nq.itemsEnabled && !isNaN(parseInt(Ky.key))) {
            Ng.emitBinary(new Uint8Array([5, parseInt(Ky.key) - 1]));
        }
        if (!Nq.itemsEnabled && Nq.awaitingUpgrades != null && !isNaN(parseInt(Ky.key))) {
            let Kl = Nq.awaitingUpgrades[Ky.key - 1];
            ym(Kl.id, Kl.name);
            return;
        }
        y4(Ky.key.toLowerCase(), 1);
    }
    );
    function xz(Ky, KK) {
        if ('switchID' in KK) {
            xv(null, [KK.switchID]);
            return;
        }
        Ng.emit('f', Ky);
    }
    NQ.addEventListener('contextmenu', function(Ky) {
        if (!Nq.ingame)
            return;
        Ky.preventDefault();
        if (Nq.stealthCooldown)
            return;
        Nq.stealth = !Nq.stealth;
        Nq.stealthCooldown = !![];
        setTimeout( () => {
            Nq.stealthCooldown = ![];
        }
        , 300);
        y4('i', 1);
    });
    document.addEventListener('keyup', Ky => {
        if (!Ky.isTrusted)
            return;
        if (!Nq.ingame)
            return;
        if (Ky.key.toLowerCase() == 'y' || Ky.key == 'Tab') {
            Ky.preventDefault();
            N7.targetSize = 0;
            N7.startRender();
            return;
        }
        let KK = Ky.key.toLowerCase();
        let KO = ![];
        if (!KO && Nq.keys.left != 'a' && KK == Nq.keys.left) {
            KK = 'a';
            KO = !![];
        }
        if (!KO && Nq.keys.right != 'd' && KK == Nq.keys.right) {
            KK = 'd';
            KO = !![];
        }
        if (!KO && Nq.keys.jump != 'a' && KK == Nq.keys.jump) {
            KK = 'w';
            KO = !![];
        }
        if (!KO && Nq.keys.stealth != 'i' && KK == Nq.keys.stealth) {
            KK = 'i';
            KO = !![];
        }
        if (!KO && Nq.keys.freeze != 'p' && KK == Nq.keys.freeze) {
            KK = 'p';
            KO = !![];
        }
        if (!KO && Nq.keys.dash != ' ' && KK == Nq.keys.dash) {
            KK = ' ';
            KO = !![];
        }
        if (KK == 'arrowleft') {
            y4('a', 0);
            return;
        }
        if (KK == 'arrowright') {
            y4('d', 0);
            return;
        }
        if (KK == 'arrowup') {
            y4('w', 0);
            return;
        }
        y4(KK, 0);
    }
    );
    function xf(Ky, KK) {
        return (Ky % KK + KK) % KK;
    }
    Ng.bin(5, () => {
        Nq.updateRot = !![];
    }
    );
    Ng.bin(6, Ky => {
        Nr.cancelJoin();
        Nq.deathscreen = ![];
        Nq.ingame = !![];
        Nq.you = Ky[1];
    }
    );
    function xR(Ky, KK) {
        Nq.clientX = Ky;
        Nq.clientY = KK;
        let KO = 1;
        if (NQ.width / 1920 > NQ.height / 1080) {
            KO = Math.round(NQ.width / 1920 * 100) / 100;
            Nq.mouseX = Ky / window.innerWidth * NQ.width - NQ.width / 2;
            Nq.mouseX /= KO;
            Nq.mouseY = KK / window.innerHeight * NQ.height - NQ.height / 2;
            Nq.mouseY /= KO;
        } else {
            KO = Math.round(NQ.height / 1080 * 100) / 100;
            Nq.mouseX = Ky / window.innerWidth * NQ.width - NQ.width / 2;
            Nq.mouseX /= KO;
            Nq.mouseY = KK / window.innerHeight * NQ.height - NQ.height / 2;
            Nq.mouseY /= KO;
        }
        let Ku = {
            'Pulse Gun': 0,
            'Spear': 0,
            'Pulse Bow': 0,
            'Cake Cannon': 0,
            'SniperRifle': 0,
            'Gatling Gun': 0,
            'Spork': 0,
            'Pistol': 0,
            'Shotgun2': 0,
            'Plasma Dagger': 0,
            'Plasma Spear': 0,
            'Chrome Orb': 0,
            'Executor': 0
        };
        if (!(Nq.weapon in Ku) && !Nq.updateRot)
            return;
        let KW = 0;
        if (Math.sign(Nq.mouseX) === -1)
            KW = 180;
        let KB = xf(Math.atan(Nq.mouseY / Nq.mouseX) * (180 / Math.PI) + KW, 360);
        let Kl = Math.hypot(Nq.mouseY, Nq.mouseX);
        let Ks = KB;
        let KZ = 0;
        if (KB > 255) {
            Ks = 255;
            KZ = KB - 255;
        }
        let Kp = new Array(10).fill(0).map( (Kh, Kg) => K2(Ks + KZ + Math.round(Kl) + 80 * Kg)).map(Kh => Math.round(Kh * 100));
        Ng.emitBinary(new Uint8Array([10, Kp[7], Kp[8], Kp[0], Ks, Kp[1], Kp[2], Kp[9], KZ, Kp[3], Kp[4], Math.round(Kl / 4), Kp[5], Kp[6]]));
    }
    var xm = null;
    document.addEventListener('pointermove', Ky => {
        if (!Ky[ND])
            return;
        if (N.active != null) {
            let KK = Ky.movementX;
            let KO = Ky.movementY;
            let Ku = i(N.active).offsetLeft + KK;
            if (Ku < 0)
                Ku = 0;
            let KW = i(N.active).offsetTop + KO;
            if (KW < 0)
                KW = 0;
            i(N.active).style.left = Ku + 'px';
            i(N.active).style.top = KW + 'px';
            return;
        }
        xR(Ky.clientX, Ky.clientY);
    }
    );
    function xn(Ky, KK, KO) {
        for (let Ku = 5; Ku < KK; Ku++) {
            Ky.setUint8(Ku, Math.floor(Math.random()));
        }
        Ky.setUint8(KO, 1);
    }
    function y0() {
        xE();
        let Ky = Nq.mouseX;
        let KK = Nq.mouseY;
        Ky = Math.max(-32768, Math.min(32767, Math.round(Ky)));
        KK = Math.max(-32768, Math.min(32767, Math.round(KK)));
        let KO = 20;
        let Ku = 16;
        const KW = new ArrayBuffer(1 + 2 + 2 + KO);
        const KB = new DataView(KW);
        KB.setUint8(0, 11);
        KB.setInt16(1, Ky, !![]);
        KB.setInt16(3, KK, !![]);
        xn(KB, KO, Ku);
        Ng.emitBinary(new Uint8Array(KW));
    }
    function y1() {
        y0();
        if (xm != null)
            return;
        xm = setInterval(y0, 40);
    }
    function y2() {
        clearInterval(xm);
        xm = null;
    }
    const y3 = {
        'w': ![],
        'a': ![],
        's': ![],
        'd': ![],
        ' ': ![]
    };
    function y4(Ky, KK) {
        let KO = y3[Ky] !== KK;
        if (KK && (Ky === 'w' || Ky === 'a' || Ky === 'd')) {
            xX();
            const Ku = Nq.players[Nq.you];
            if (Ku?.focusType === 'controls1') {
                Ku.focus = ![];
                Ku.focusType = null;
            }
        }
        if (Ky in y3 && Nq.prediction) {
            y3[Ky] = KK;
            return;
        }
        if (Ky in y3)
            y3[Ky] = KK;
        if (Ky.length > 1)
            return;
        if (KO && !document.hidden)
            Ng.emitBinary(new Uint8Array([2, Ky.charCodeAt(0), KK]));
    }
    let y5 = !![];
    let y6 = ![];
    let y7 = null;
    function y8() {
        let Ky = document.getElementById('enteringGameScreen');
        let KK = document.getElementById('enteringGameText');
        if (Ky == null) {
            Ky = document.createElement('div');
            Ky.id = 'enteringGameScreen';
            Ky.setAttribute('role', 'status');
            Ky.setAttribute('aria-live', 'polite');
            Object.assign(Ky.style, {
                'position': 'fixed',
                'inset': '0',
                'zIndex': '2147483647',
                'display': 'none',
                'alignItems': 'center',
                'justifyContent': 'center',
                'background': 'radial-gradient(circle at center, #28443e 0%, #111817 65%, #080c0b 100%)',
                'color': 'white',
                'fontFamily': 'Quicksand, sans-serif',
                'pointerEvents': 'auto'
            });
            KK = document.createElement('p');
            KK.id = 'enteringGameText';
            Object.assign(KK.style, {
                'margin': '0',
                'fontSize': 'clamp(26px, 4vw, 44px)',
                'fontWeight': '700',
                'letterSpacing': '0.04em',
                'textShadow': '0 3px 12px rgba(0, 0, 0, 0.65)'
            });
            Ky.appendChild(KK);
            document.body.appendChild(Ky);
        }
        return {
            'screen': Ky,
            'text': KK
        };
    }
    function y9() {
        if (y6)
            return;
        clearInterval(window.__realmzEarlyJoinAnimation);
        window.__realmzEarlyJoinAnimation = null;
        y6 = !![];
        const Ky = y8();
        document.getElementById('titleContainer')?.style.setProperty('display', 'none');
        let KK = 3;
        const KO = () => {
            Ky.text.textContent = 'Entering game' + '.'.repeat(KK);
            KK = KK % 3 + 1;
        }
        ;
        Ky.screen.style.display = 'flex';
        Ky.screen.style.visibility = 'visible';
        KO();
        y7 = setInterval(KO, 350);
    }
    function yI() {
        clearInterval(y7);
        clearInterval(window.__realmzEarlyJoinAnimation);
        y7 = null;
        window.__realmzEarlyJoinAnimation = null;
        y6 = ![];
        const Ky = y8();
        Ky.screen.style.display = 'none';
        Ky.screen.style.visibility = 'hidden';
    }
    function ya() {
        if (!y6 || !Nq.ready.map || !Nq.ready.files)
            return;
        yI();
        window.join();
    }
    let yG = null;
    Ng.bin(24, Ky => {
        const KK = Ky.subarray(1);
        yG = new TextDecoder().decode(KK);
    }
    );
    function yi(Ky) {
        let KK = document.querySelector('meta[name="realmz-device-type"]').content;
        let KO = {
            'name': Ky,
            'analytics': U.prepareSession(Nq.account?.plays)
        };
        if (Nq.settings.showdevice) {
            KO.device = KK;
        }
        if (localStorage.getItem('playedBefore') !== 'true') {
            KO.playedBefore = ![];
        }
        Nq.name = Ky;
        if (y5) {
            Nb();
            setTimeout(Nb, 10000);
        }
        const Ku = xk(KO, yG + '21387');
        const KW = new Uint8Array(Ku.length + 1);
        KW[0] = 25;
        KW.set(Ku, 1);
        Ng.emitBinary(KW);
    }
    function yN(Ky) {
        const KK = document.getElementById(Ky);
        if (!KK)
            return ![];
        const KO = document.elementFromPoint(Nq.clientX, Nq.clientY);
        return KO === KK || KK.contains(KO);
    }
    i('deathRespawnButton').addEventListener('click', Ky => {
        if (!Ky[ND])
            return;
        yO();
    }
    );
    i('play').addEventListener('click', Ky => {
        if (!Ky[ND])
            return;
        yy();
    }
    );
    i('gravestoneButton').addEventListener('click', Ky => {
        if (!Ky[ND])
            return;
        yK();
    }
    );
    let yx = !![];
    function yy(Ky) {
        if (Nr.challenge)
            return;
        if (!Ky && !yN('play') && !yx)
            return;
        yx = ![];
        Nr.requestJoin();
        console.log(Nq.ready);
        if (!Nq.ready.map || !Nq.ready.files) {
            y9();
            return;
        }
        for (let KO in y3)
            y3[KO] = ![];
        A();
        document.getElementById('accountLoginPanel')?.classList.remove('open');
        document.getElementById('titleContainer').style.display = 'none';
        i('DEATH_SCREEN_BOX').style.visibility = 'hidden';
        i('upgradecounttoggle').style.visibility = 'visible';
        if (i('inner').style.visibility == 'hidden')
            toggleWeapons();
        xb('frozen', 0);
        xb('stealth', 0);
        if (Nq.mobile)
            document.getElementById('mobile').style.visibility = 'visible';
        let KK = document.getElementById('name').value;
        KK = KK.substring(0, 25);
        if (Nq.loadPerformance.playClicked == null)
            Nq.loadPerformance.playClicked = Date.now();
        Nq.ingame = !![];
        localStorage.setItem('name', KK);
        yi(KK);
        localStorage.setItem('playedBefore', 'true');
        I0();
        hideADs();
        if (Nq.mobile) {
            fullscreen();
        }
        y5 = ![];
        i('lb').style.display = 'block';
        if (!Nq.mobile)
            i('minimap').style.display = 'block';
        aiptag.cmd.display.push(function() {
            aipDisplayTag.destroy();
        });
    }
    if (window.__realmzEarlyEnterHandler != null) {
        document.removeEventListener('keydown', window.__realmzEarlyEnterHandler);
        window.__realmzEarlyEnterHandler = null;
    }
    if (window.__realmzEarlyJoinRequested) {
        window.__realmzEarlyJoinRequested = ![];
        window.join();
    }
    function yK() {
        i('DEATH_SCREEN_BOX').style.visibility = 'hidden';
        i('DEATH_SCREEN_BOX').style.position = 'absolute';
        document.getElementById('titleContainer').style.display = 'flex';
        i('infoText').innerHTML = '';
        I1();
        Nq.deathscreen = ![];
        Nq.ingame = ![];
        if (Nq.adinplay) {}
        i('lb').style.display = 'none';
        i('minimap').style.display = 'none';
    }
    function yO() {
        if (Nr.challenge)
            return;
        if (!yN('deathRespawnButton'))
            return;
        yK();
        yy(!![]);
    }
    function yu(Ky, KK) {
        Nq.ingame = ![];
        if (Ky?.analytics)
            U.handleDeath(Ky.analytics);
        else
            U.endSession();
        if (Nq.crazygames) {}
        i('upgradecounttoggle').style.visibility = 'hidden';
        deathScreen(Ky, KK);
        return;
    }
    const yW = [15, 35, 70];
    function yB(Ky) {
        const KK = Math.min(Math.ceil(Ky * 0.2), 43000);
        return Math.floor(Math.cbrt(KK));
    }
    window.deathScreen = function(Ky, KK) {
        const KO = Number.isFinite(Number(Ky.level)) ? Math.max(0, Math.floor(Number(Ky.level))) : 0;
        const Ku = Number.isFinite(Number(Ky.kills)) ? Math.max(0, Math.floor(Number(Ky.kills))) : 0;
        const KW = Number.isFinite(Nq.updatePlayerData.xp) ? Nq.updatePlayerData.xp : 0;
        const KB = yV(yH);
        const Kl = !Ky.account && KO > KB;
        yj(KO);
        i('DEATH_SCREEN_BOX').style.visibility = 'visible';
        i('DEATH_SCREEN_BOX').style.position = 'relative';
        Nq.deathscreen = !![];
        if (Ky.account) {
            i('DEATH_INFO').textContent = Nq.name + '\nLevel: ' + KO + '\nKills: ' + Ku + '\nCoins: ' + Ky.coins + '\nStars: ' + Ky.stars;
        } else {
            i('DEATH_INFO').textContent = Nq.name + '\x0aLevel: ' + KO + '\nKills: ' + Ku + (Kl ? '\x0aNEW BEST RUN' : '');
        }
        i('deathRespawnButton').textContent = 'RESPAWN AT LEVEL ' + yB(KW);
        const Ks = i('deathWeaponProgress');
        const KZ = yW.find(Kh => Kh > KO);
        const Kp = window.location.pathname.startsWith('/crazygames') && KO < 70 && KZ != null;
        Ks.hidden = !Kp;
        if (Kp) {
            const Kh = KZ - KO;
            Ks.textContent = Kh + ' ' + (Kh === 1 ? 'LEVEL' : 'LEVELS') + ' AWAY FROM A NEW WEAPON';
        }
        if (Nq.adinplay)
            showAD('realmz-io_970x250');
        document.getElementById('weaponSelector').classList.remove('weapon-selector-visible');
        document.getElementById('inner').innerHTML = '';
        Nq.xp = 0;
        Nq.freeze = ![];
        Nq.stealth = ![];
        document.getElementById('upgradecount').innerHTML = '';
        document.getElementById('upgradebar').innerHTML = '';
        document.getElementById('mobile').style.visibility = 'hidden';
        Nq.upgrades = {};
        A();
        if (Ky.account)
            R();
    }
    ;
    Ng.on('leaveGame', (Ky, KK) => {
        Nr.cancelJoin();
        xb('frozen', 0);
        xb('stealth', 0);
        yu(Ky, KK);
    }
    );
    function yl(Ky) {
        U.startSession(Ky);
        if (document.hidden) {
            Ng.emit('analyticsVisibility', {
                'sessionId': Ky?.sessionId ?? U.getSessionId(),
                'hidden': !![]
            });
        }
    }
    function ys(Ky) {
        U.handleCheckpoint(Ky);
    }
    function yZ(Ky) {
        U.handleFirstMobKill(Ky);
    }
    function yp(Ky) {
        U.handleBossKill(Ky);
    }
    Ng.on('analyticsSessionStarted', yl);
    Ng.on('analyticsSnapshot', ys);
    Ng.on('analyticsFirstMobKill', yZ);
    Ng.on('analyticsBossKilled', yp);
    function yh() {
        Ng.emit('a', K3());
    }
    Ng.on('notif', Ky => {
        let KK = document.createElement('div');
        KK.innerText = Ky.msg;
        KK.style.color = Ky.color;
        i('notificationCenterTop').appendChild(KK);
        setTimeout( () => {
            KK.remove();
        }
        , 8000);
    }
    );
    const yg = 100;
    let yr = Promise.resolve();
    function yD(Ky, KK) {
        yr = yr.then( () => new Promise(KO => setTimeout(KO, yg))).then( () => yQ(Ky, KK))['catch'](KO => console.error('Failed to show queued weapon menu.', KO));
    }
    function yQ(Ky, KK) {
        U.handleLevel(KK);
        const KO = document.getElementById('weaponSelector');
        const Ku = document.getElementById('inner');
        KO.classList.remove('weapon-selector-visible');
        const KW = document.createDocumentFragment();
        Nq.showWeaponMenu = !![];
        Ku.style.visibility = 'visible';
        for (let KB = 0; KB < Ky.length; KB++) {
            const Kl = 'weapon_' + KB;
            const Ks = document.createElement('div');
            const KZ = document.createElement('div');
            const Kp = document.createElement('div');
            const Kh = Ky[KB].name;
            const Kg = yc(Kh);
            const Kr = Number.isSafeInteger(Ky[KB].evolutionCount) ? Ky[KB].evolutionCount : Ky[KB].next.length;
            const KD = document.createElement('div');
            KD.className = 'weapon-name';
            KD.textContent = Kg ? '???' : Kh;
            const KQ = document.createElement('img');
            const KM = G[Kh];
            KQ.className = 'weaponIcon';
            KQ.setAttribute('weaponID', encodeURI(Kh));
            KQ.src = gameAsset('./images/itemmap.png');
            KQ.alt = Kg ? 'Undiscovered weapon silhouette' : Kh;
            KQ.style.objectFit = 'none';
            KQ.style.objectPosition = '-' + 50 * (KM % 20) + 'px -' + 50 * Math.floor(KM / 20) + 'px';
            if (Kg) {
                KQ.style.filter = 'brightness(0)';
            }
            const KY = document.createElement('div');
            KY.className = 'weapon-playstyle';
            KY.textContent = yM(Kh);
            const KX = document.createElement('div');
            KX.className = 'weapon-evolutions';
            KX.textContent = yY(Kr, Kg);
            Ks.className = 'weapon';
            Ks.classList.toggle('weapon-locked', Kg);
            Ks.id = Kl;
            Ks.append(KD, KQ, KY, KX);
            KZ.className = 'weapon-slot';
            KZ.addEventListener('click', () => yq(Kh));
            Kp.className = 'weapon-bob';
            Kp.appendChild(Ks);
            KZ.appendChild(Kp);
            KW.appendChild(KZ);
        }
        Ku.replaceChildren(KW);
        if (Ku.childElementCount > 0)
            KO.classList.add('weapon-selector-visible');
    }
    Ng.on('weapon', yD);
    function yM(Ky) {
        const KK = J[Ky]?.[0] || 'Unique combat style';
        return KK.replace(/[.!]+$/, '');
    }
    function yY(Ky, KK) {
        if (Ky === 0)
            return KK ? 'No evolutions' : 'Final evolution';
        return 'Evolves into ' + Ky + ' weapon' + (Ky === 1 ? '' : 's');
    }
    const yX = 'weaponProgress';
    let yE = null;
    let yv = null;
    let ye = 0;
    function yL(Ky) {
        const KK = Array.isArray(Ky) ? Ky : [];
        const KO = ['Swordsman', 'Archer', 'Magician'].map(Ku => G[Ku]);
        return [...new Set([...KO, ...KK].map(Number).filter(Ku => Number.isSafeInteger(Ku) && Ku >= 0))].sort( (Ku, KW) => Ku - KW);
    }
    function yS() {
        if (yE != null)
            return yE.slice();
        let Ky = localStorage.getItem(yX);
        if (Ky != null) {
            try {
                yE = yL(JSON.parse(Ky));
                yv = new Set(yE);
                ye++;
                return yE.slice();
            } catch (Ku) {
                console.warn('Invalid saved weapon progress; resetting it.', Ku);
            }
        }
        const KK = localStorage.getItem('weapons');
        const KO = [];
        if (typeof KK === 'string') {
            for (let KW = 0; KW < KK.length; KW++) {
                if (KK[KW] === '1')
                    KO.push(KW);
            }
        }
        return yA(KO);
    }
    function yA(Ky) {
        const KK = yL(Ky);
        yE = KK;
        yv = new Set(KK);
        ye++;
        localStorage.setItem(yX, JSON.stringify(KK));
        localStorage.removeItem('weapons');
        return KK.slice();
    }
    function yk() {
        if (yE == null)
            yS();
        return ye;
    }
    function yo(Ky) {
        return yA(Ky);
    }
    function yT() {
        if (Nq.you == null || Nq.players[Nq.you] == null)
            return;
        const Ky = [];
        for (let KK = 0; KK < 42; KK++) {
            Ky.push({
                'vx': Math.random() * 360 - 180,
                'vy': -(Math.random() * 210 + 130),
                'size': Math.random() * 7 + 5,
                'rotation': Math.random() * Math.PI,
                'spin': Math.random() * 12 - 6,
                'color': 'hsl(' + Math.floor(Math.random() * 360) + ', 90%, 58%)'
            });
        }
        xQ({
            'type': 'confetti',
            'bind': Nq.you,
            'pieces': Ky,
            'time': 1500
        });
    }
    function yJ(Ky) {
        if (!Object.prototype.hasOwnProperty.call(G, Ky))
            return ![];
        const KK = G[Ky];
        const KO = yS();
        if (KO.includes(KK))
            return ![];
        KO.push(KK);
        yA(KO);
        yT();
        let Ku = N2[N4[Ky] + 1];
        let KW = !!Ku ? 'Next weapon at LEVEL ' + Ku : '';
        yF('DISCOVERED ' + Ky, yw() + '/' + yd() + ' unlocked. ' + KW);
        return !![];
    }
    function yd() {
        return Object.keys(G).length;
    }
    function yw() {
        const Ky = new Set(Object.values(G));
        return yS().filter(KK => Ky.has(KK)).length;
    }
    function yP() {
        const Ky = new Set(yS());
        return Object.values(N3).some(KK => Object.keys(KK).some(KO => Ky.has(G[KO])));
    }
    const yH = 'cg.stat.highestLevel';
    const yt = 'cg.stat.weaponsDiscovered';
    function yV(Ky) {
        const KK = Number.parseInt(localStorage.getItem(Ky), 10);
        return Number.isSafeInteger(KK) && KK >= 0 ? KK : 0;
    }
    function yj(Ky) {
        if (!Nq.crazygames)
            return;
        const KK = Number.isFinite(Number(Ky)) ? Math.max(0, Math.floor(Number(Ky))) : 0;
        const KO = Math.max(yV(yH), KK);
        const Ku = Math.max(yV(yt), yw());
        localStorage.setItem(yH, KO);
        localStorage.setItem(yt, Ku);
        i('cgHighestLevel').innerText = KO;
        i('cgWeaponsDiscovered').innerText = Ku;
        i('cgTotalWeapons').innerText = yd();
    }
    yj(0);
    function yc(Ky) {
        if (!Object.prototype.hasOwnProperty.call(G, Ky))
            return !![];
        if (yv == null)
            yS();
        return !yv.has(G[Ky]);
    }
    function yq(Ky) {
        if (Ng.ws.readyState !== 1)
            return;
        var KK = document.getElementById('inner');
        Nq.weapon = Ky;
        U.weaponSelected(Ky);
        Ng.emit('upgradeWeapon', Ky);
        document.getElementById('weaponSelector').classList.remove('weapon-selector-visible');
        KK.replaceChildren();
    }
    Ng.on('weaponDiscovered', Ky => {
        yJ(Ky);
    }
    );
    function yb(Ky) {
        let KK = document.createElement('div');
        KK.innerText = Ky;
        KK.setAttribute('class', 'mainNotification');
        i('notificationCenterMiddle').appendChild(KK);
        setTimeout( () => {
            KK.remove();
        }
        , 10000);
    }
    function yF(Ky, KK) {
        document.querySelectorAll('.notif3').forEach(KW => {
            KW.classList.add('notif3-exit');
        }
        );
        const KO = document.createElement('div');
        KO.className = 'notif3';
        const Ku = document.createElement('div');
        Ku.className = 'notif3-header';
        Ku.textContent = Ky;
        KO.appendChild(Ku);
        if (KK) {
            const KW = document.createElement('div');
            KW.className = 'notif3-subheader';
            KW.textContent = KK;
            KO.appendChild(KW);
        }
        document.body.appendChild(KO);
        KO.addEventListener('animationend', () => KO.remove(), {
            'once': !![]
        });
    }
    let yU = ![];
    let yC = null;
    let yz = null;
    function yf(Ky) {
        const KK = document.getElementById('upgradebar');
        if (yz != null)
            cancelAnimationFrame(yz);
        KK.classList.remove('upgradebar-leave', 'upgradebar-enter');
        const KO = document.createDocumentFragment();
        const Ku = document.createElement('div');
        Ku.className = 'upgradebar-title';
        Ku.textContent = 'Choose Upgrade';
        KO.appendChild(Ku);
        for (let KW in Ky) {
            const KB = Ky[KW].name;
            const Kl = x[Ky[KW].id].color;
            const Ks = document.createElement('button');
            Ks.className = 'upgrade ' + Kl;
            Ks.setAttribute('u', Ky[KW].id);
            Ks.setAttribute('u2', KB);
            Ks.appendChild(document.createTextNode(KB));
            const KZ = document.createElement('div');
            KZ.className = 'tooltip';
            KZ.textContent = x[Ky[KW].id].desc;
            Ks.appendChild(KZ);
            KO.appendChild(Ks);
        }
        KK.replaceChildren(KO);
        yz = requestAnimationFrame( () => {
            yz = null;
            if (!yU && KK.childElementCount > 0) {
                KK.classList.add('upgradebar-enter');
            }
        }
        );
    }
    function yR(Ky, KK) {
        U.handleLevel(KK);
        Nq.awaitingUpgrades = Ky;
        let KO = S(Ky);
        if (KO != null) {
            ym(KO.id, KO.name);
            return;
        }
        if (yU) {
            yC = Ky;
            return;
        }
        yf(Ky);
    }
    Ng.on('upgrade', yR);
    document.getElementById('upgradebar').addEventListener('click', Ky => {
        if (yU || Ng.ws.readyState !== 1)
            return;
        const KK = Ky.target.closest('.upgrade');
        if (KK == null)
            return;
        let KO = KK.getAttribute('u');
        let Ku = KK.getAttribute('u2');
        if (KO == null)
            return;
        ym(KO, Ku);
    }
    );
    function ym(Ky, KK) {
        if (yU)
            return;
        U.upgradeSelected(Ky === 's' ? 'speed' : Ky);
        Nq.awaitingUpgrades = null;
        let KO = document.getElementById('upgradebar');
        let Ku = document.getElementById('upgradecount');
        if (Nq.upgrades[Ky] == null) {
            let KB = document.createElement('button');
            KB.setAttribute('class', 'upgrade2 ' + x[Ky].color);
            KB.setAttribute('id', 'UC_' + Ky);
            KB.innerHTML = KK;
            Ku.appendChild(KB);
        } else {
            let Kl = document.getElementById('UC_' + Ky);
            Kl.innerHTML = KK;
        }
        Nq.upgrades[Ky] = KK;
        if (KO.childElementCount === 0) {
            Ng.emit('upgraded', {
                'type': Ky
            });
            return;
        }
        yU = !![];
        if (yz != null) {
            cancelAnimationFrame(yz);
            yz = null;
        }
        KO.classList.remove('upgradebar-enter');
        KO.classList.add('upgradebar-leave');
        let KW = () => {
            if (!yU)
                return;
            yU = ![];
            KO.classList.remove('upgradebar-leave');
            KO.replaceChildren();
            Ng.emit('upgraded', {
                'type': Ky
            });
            if (yC != null) {
                let Ks = yC;
                yC = null;
                yf(Ks);
            }
        }
        ;
        KO.addEventListener('animationend', Ks => {
            if (Ks.target === KO && Ks.animationName === 'upgradebar-fade-out')
                KW();
        }
        , {
            'once': !![]
        });
        setTimeout(KW, 250);
    }
    function yn() {
        return K0(1143713351456);
    }
    function K0(Ky) {
        let KK = Math.round(Date.now() / 3000) * 3000 + Ky;
        let KO = +'' + Math.round(Math.random() * 9) + '' + Math.round(Math.random() * 9).toString() + Math.round(Math.random() * 9).toString() + Math.round(Math.random() * 9) + Math.round(Math.random() * 9).toString();
        return (K1(KK)() + '').substring(2) + KO;
    }
    function K1(Ky) {
        return function() {
            var KK = Ky += 1831565813;
            KK = Math.imul(KK ^ KK >>> 15, KK | 1);
            KK ^= KK + Math.imul(KK ^ KK >>> 7, KK | 61);
            return ((KK ^ KK >>> 14) >>> 0) / 4294967296;
        }
        ;
    }
    function K2(Ky) {
        Ky |= 0;
        Ky = Math.imul(Ky ^ Ky >>> 16, 73244475);
        Ky = Math.imul(Ky ^ Ky >>> 16, 73244475);
        Ky = Ky ^ Ky >>> 16;
        return (Ky >>> 0) / 4294967296;
    }
    function K3() {
        return K4(5514772177319);
    }
    function K4(Ky) {
        let KK = Math.round(Date.now() / 500) * 500 + Ky;
        return (K1(KK)() + '').substring(2);
    }
    Ng.on('notif2', Ky => {
        yb(Ky.msg, Ky.color);
        return;
        Nq.notif = {
            'msg': Ky.msg,
            'color': Ky.color
        };
        log(Ky.msg);
        setTimeout( () => {
            Nq.notif = null;
        }
        , 8000);
    }
    );
    Ng.on('notif3', Ky => {
        yF(Ky.header ?? Ky.msg ?? '', Ky.subheader ?? '');
    }
    );
    Ng.on('dash', Ky => {
        Nq.dash = {
            'end': Date.now() + Ky,
            'time': Ky
        };
    }
    );
    Ng.on('statusBox', Ky => {
        openStatusBox(Ky, !![]);
    }
    );
    const K5 = 10;
    let K6 = null;
    function K7() {
        const Ky = document.getElementById('lblist');
        Ky.replaceChildren();
        K6 = [];
    }
    function K8(Ky) {
        const KK = document.createElement('div');
        KK.className = 'lbthing';
        const KO = document.createElement('left');
        const Ku = document.createElement('left1');
        const KW = document.createElement('b');
        const KB = document.createElement('span');
        Ku.append(KW, document.createTextNode(' - '), KB);
        const Kl = document.createElement('left2');
        const Ks = document.createElement('sub');
        Ks.style.fontWeight = '500';
        Kl.appendChild(Ks);
        KO.append(Ku, Kl);
        const KZ = document.createElement('right');
        const Kp = document.createTextNode('');
        const Kh = document.createElement('sub');
        Kh.style.fontWeight = '500';
        const Kg = document.createTextNode('');
        KZ.append(Kp, document.createTextNode(' '), Kh, document.createTextNode(' 🕱'), Kg);
        KK.append(KO, KZ);
        Ky.appendChild(KK);
        return {
            'node': KK,
            'left1': Ku,
            'left2': Kl,
            'rank': KW,
            'name': KB,
            'weapon': Ks,
            'level': Kp,
            'xp': Kh,
            'kills': Kg,
            'data': {}
        };
    }
    function K9(Ky) {
        const KK = Array.isArray(Ky?.k) ? Ky.k : [];
        const KO = Nq.players;
        const Ku = Nq.mobile;
        NX = KK;
        if (!K6)
            K7();
        for (let Kl = 0; Kl < KK.length; Kl++) {
            const Ks = KK[Kl];
            const KZ = KO[Ks.id];
            if (!KZ)
                continue;
            KZ.xp = Ks.xp;
            KZ.lvl = Ks.lvl;
        }
        const KW = KK.map(Kp => ({
            'entry': Kp,
            'player': KO[Kp.id]
        })).filter( ({player: Kp}) => Kp != null).slice(0, Ku ? 5 : K5);
        const KB = document.getElementById('lblist');
        while (K6.length > KW.length)
            K6.pop().node.remove();
        while (K6.length < KW.length)
            K6.push(K8(KB));
        for (let Kp = 0; Kp < KW.length; Kp++) {
            const {entry: Kh, player: Kg} = KW[Kp];
            const Kr = K6[Kp];
            const KD = Kr.data;
            if (KD.rank !== Kp + 1) {
                Kr.rank.textContent = Kp + 1;
                KD.rank = Kp + 1;
            }
            const KQ = Kg.name ?? '';
            if (KD.name !== KQ) {
                Kr.name.textContent = KQ;
                KD.name = KQ;
            }
            const KM = typeof Kg.nameColor === 'string' ? Kg.nameColor : '';
            if (KD.nameColor !== KM) {
                Kr.name.style.color = '';
                if (KM)
                    Kr.name.style.color = KM;
                KD.nameColor = KM;
            }
            if (KD.level !== Kg.lvl) {
                Kr.level.nodeValue = 'Lvl.' + Kg.lvl;
                KD.level = Kg.lvl;
            }
            if (KD.kills !== Kg.kills) {
                Kr.kills.nodeValue = Kg.kills;
                KD.kills = Kg.kills;
            }
            if (!Ku) {
                if (Kr.left2.hidden)
                    Kr.left2.hidden = ![];
                if (Kr.xp.hidden)
                    Kr.xp.hidden = ![];
                if (KD.weapon !== Kg.weapon.type) {
                    Kr.weapon.textContent = 'The ' + Kg.weapon.type;
                    KD.weapon = Kg.weapon.type;
                }
                if (KD.xp !== Kh.xp) {
                    Kr.xp.textContent = Kh.xp;
                    KD.xp = Kh.xp;
                }
            } else {
                if (!Kr.left2.hidden)
                    Kr.left2.hidden = !![];
                if (!Kr.xp.hidden)
                    Kr.xp.hidden = !![];
            }
        }
    }
    Ng.on('lb', K9);
    var KI = {};
    var Ka = {};
    function KG() {
        for (let KO in Nq.items) {
            let Ku = Nq.items[KO];
            Ku.v++;
            if (Nq.items[KO].v > 12)
                Nq.items[KO].v = 12;
            Ku.lastX = xI(Ku, ![], ![], Date.now(), j.lastTick);
            Ku.lastY = xa(Ku, ![], ![], Date.now(), j.lastTick);
            moveY.bind(Ku)(Ku.v, V, {
                'map': Nq.map
            });
        }
        j.lastTick = Date.now();
        if (!Nq.prediction)
            return;
        if (!Nq.ingame)
            return;
        for (let KW in Ka) {
            j.handleKey(KW, Ka[KW]);
        }
        t.update();
        t.update();
        j.tick(Nq.updatePlayerData.player);
        let Ky = {
            'w': 2,
            'a': 4,
            's': 8,
            'd': 16,
            ' ': 32
        };
        let KK = 0;
        for (let KB in Ky) {
            KK += Ky[KB] * y3[KB];
        }
        if (Ng.ws.readyState === 1)
            Ng.emitBinary(new Uint16Array([4, KK]));
        for (let Kl in y3)
            Ka[Kl] = y3[Kl];
    }
    Ng.on('console', Ky => {
        log(Ky);
    }
    );
    let Ki = NM.createRadialGradient(Nw.width / 2, Nw.height / 2, 0, Nw.width / 2, Nw.height / 2, NQ.height / 2);
    Ki.addColorStop(0, 'rgba(255, 175, 0, 1.3)');
    Ki.addColorStop(1, 'black');
    let KN = NM.createRadialGradient(Nw.width / 2, Nw.height / 2, 0, Nw.width / 2, Nw.height / 2, NQ.height / 2);
    KN.addColorStop(0, 'rgba(0, 0, 0, 0)');
    KN.addColorStop(0.85, 'rgba(255, 0, 0, 0.3)');
    NZ();
}
)());
