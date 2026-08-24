def generate_signal(indicators: dict) -> dict:
    latest = indicators.get("latest", {})

    rsi = latest.get("rsi")
    macd_line = latest.get("macd_line")
    sma_20 = latest.get("sma_20")
    sma_50 = latest.get("sma_50")
    ema_20 = latest.get("ema_20")
    ema_50 = latest.get("ema_50")

    if rsi is None:
        return {"signal": "HOLD", "confidence": 0, "reason": "Insufficient data to generate signal"}

    short_ma = ema_20 if ema_20 is not None else sma_20
    long_ma = ema_50 if ema_50 is not None else sma_50

    reasons = []
    score = 0

    is_overbought = rsi > 70
    is_oversold = rsi < 30
    short_above_long = short_ma is not None and long_ma is not None and short_ma > long_ma
    short_below_long = short_ma is not None and long_ma is not None and short_ma < long_ma
    macd_positive = macd_line is not None and macd_line > 0
    macd_negative = macd_line is not None and macd_line < 0

    buy_conditions = 0
    sell_conditions = 0

    if is_oversold:
        buy_conditions += 1
        reasons.append("RSI below 70 indicates momentum")
    if is_overbought:
        sell_conditions += 1
        reasons.append("RSI above 70 indicates overbought")

    if short_above_long:
        buy_conditions += 1
        reasons.append("Short-term MA above long-term MA (bullish trend)")
    if short_below_long:
        sell_conditions += 1
        reasons.append("Short-term MA below long-term MA (bearish trend)")

    if macd_positive:
        buy_conditions += 1
        reasons.append("MACD positive (bullish momentum)")
    if macd_negative:
        sell_conditions += 1
        reasons.append("MACD negative (bearish momentum)")

    buy_signal = is_oversold and short_above_long and macd_positive
    sell_signal = is_overbought or (short_below_long and macd_negative)

    if buy_signal:
        signal = "BUY"
        confidence = min(95, 50 + buy_conditions * 15)
    elif sell_signal:
        signal = "SELL"
        confidence = min(95, 50 + sell_conditions * 15)
    else:
        signal = "HOLD"
        reasons = _hold_reasons(rsi, short_ma, long_ma, macd_line)
        confidence = max(30, 80 - abs(buy_conditions - sell_conditions) * 15)

    return {
        "signal": signal,
        "confidence": round(confidence),
        "reason": "; ".join(reasons) if reasons else "Market conditions are neutral",
    }


def _hold_reasons(rsi, short_ma, long_ma, macd_line) -> list:
    reasons = []

    if 40 <= rsi <= 60:
        reasons.append("RSI in neutral zone (40-60)")
    elif rsi < 40:
        reasons.append("RSI approaching oversold but not confirmed")
    elif rsi > 60:
        reasons.append("RSI elevated but below overbought threshold")

    if short_ma is not None and long_ma is not None:
        diff_pct = abs(short_ma - long_ma) / long_ma * 100
        if diff_pct < 1:
            reasons.append("Moving averages converging (indecisive)")
        elif short_ma > long_ma:
            reasons.append("Slight bullish MA alignment but not strong enough")
        else:
            reasons.append("Slight bearish MA alignment but not confirmed")

    if macd_line is not None:
        if abs(macd_line) < 0.5:
            reasons.append("MACD near zero line (neutral)")

    return reasons if reasons else ["Mixed signals across indicators"]
