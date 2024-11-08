const DeviceType = {
    EOS: "eos",
}

const DeviceStatuses = {
    [DeviceType.EOS]: ["online", "offline"]
}

// Export the enums
module.exports = { DeviceType, DeviceStatuses };

