import Config from '../config/config.js'

const SAVEDCOUNTSKEY = Config.countKey

const DEFAULTCOUNT = Config.savedCounts

function myIsNaN(value) {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * 获取剩下保存次数
 */
function getSavedCounts() {
    try {
        let res = uni.getStorageSync(SAVEDCOUNTSKEY)
        if (res) {
            res = JSON.parse(res)
            if (res.end > 60000) {
                if (myIsNaN(res.key)) {
                    return res.key
                } else {
                    // 出错了 存默认
                    setSavedCounts(DEFAULTCOUNT)
                    return DEFAULTCOUNT
                }
            } else {
                // 过期了 存默认
                setSavedCounts(DEFAULTCOUNT)
                return DEFAULTCOUNT
            }
        } else {
            // 第一次 存默认
            setSavedCounts(DEFAULTCOUNT)
            return DEFAULTCOUNT
        }
    } catch (e) {}

    return false;
}

/**
 * 每次看完广告 调用存储 {addCounts}次 / 过期了存储{savedCounts}次
 * @param {string} number
 */
function setSavedCounts(number) {
    try {
        let endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime() - new Date().getTime()
        uni.setStorageSync(SAVEDCOUNTSKEY, JSON.stringify({key: number, end: endTime}))
        return true
    } catch (e) {
        // console.log(e);
        return false
    }
}

export { setSavedCounts, getSavedCounts }