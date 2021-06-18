function getSaveCounts(KEY) {
    try {
        let res = uni.getStorageSync(KEY)
        if (res) {
            res = JSON.parse(res)
            if (res.end > new Date().getTime()) {
                return res.key
            }
        }
    } catch (e) {}

    return false;
}

function setSaveCounts(KEY, VALUE) {
    try {
        uni.setStorageSync(KEY, JSON.stringify({key: VALUE, end: new Date().getTime() + 3600000 * 24 * 7}))
        return true
    } catch (e) {
        return false
    }
}

export {getSaveCounts, setSaveCounts}