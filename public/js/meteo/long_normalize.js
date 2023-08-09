function normalizeLongitude(longitude) {
    var normalizedLongitude = longitude % 360;
    if (normalizedLongitude > 180) {
      normalizedLongitude -= 360;
    } else if (normalizedLongitude < -180) {
      normalizedLongitude += 360;
    }
    return normalizedLongitude;
  }

export {normalizeLongitude}