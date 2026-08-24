import pandas as pd
import numpy as np


def calculate_indicators(df: pd.DataFrame) -> dict:
    close = df["close"]

    sma_20 = _sma(close, 20)
    sma_50 = _sma(close, 50)
    sma_200 = _sma(close, 200)
    ema_20 = _ema(close, 20)
    ema_50 = _ema(close, 50)
    rsi = _rsi(close, 14)
    macd_line, signal_line, histogram = _macd(close, 12, 26, 9)
    upper_bb, middle_bb, lower_bb = _bollinger_bands(close, 20, 2)

    daily_returns = close.pct_change().dropna()
    volatility = float(daily_returns.std() * np.sqrt(252) * 100) if len(daily_returns) > 1 else 0.0

    result = {
        "sma_20": _safe_series(sma_20, df["date"]),
        "sma_50": _safe_series(sma_50, df["date"]),
        "sma_200": _safe_series(sma_200, df["date"]),
        "ema_20": _safe_series(ema_20, df["date"]),
        "ema_50": _safe_series(ema_50, df["date"]),
        "rsi": _safe_series(rsi, df["date"]),
        "macd": {
            "macd_line": _safe_series(macd_line, df["date"]),
            "signal_line": _safe_series(signal_line, df["date"]),
            "histogram": _safe_series(histogram, df["date"]),
        },
        "bollinger_bands": {
            "upper": _safe_series(upper_bb, df["date"]),
            "middle": _safe_series(middle_bb, df["date"]),
            "lower": _safe_series(lower_bb, df["date"]),
        },
        "statistics": {
            "current_price": _safe_float(close.iloc[-1]),
            "daily_returns": _safe_series(daily_returns, df["date"].iloc[1:]),
            "average_return": _safe_float(daily_returns.mean() * 100),
            "volatility": round(volatility, 2),
            "max_price": _safe_float(df["high"].max()),
            "min_price": _safe_float(df["low"].min()),
            "percentage_growth": _safe_float(
                ((close.iloc[-1] - close.iloc[0]) / close.iloc[0]) * 100
                if len(close) > 1 else 0.0
            ),
        },
        "latest": {
            "sma_20": _safe_float(sma_20.iloc[-1]) if len(sma_20) > 0 else None,
            "sma_50": _safe_float(sma_50.iloc[-1]) if len(sma_50) > 0 else None,
            "sma_200": _safe_float(sma_200.iloc[-1]) if len(sma_200) > 0 else None,
            "ema_20": _safe_float(ema_20.iloc[-1]) if len(ema_20) > 0 else None,
            "ema_50": _safe_float(ema_50.iloc[-1]) if len(ema_50) > 0 else None,
            "rsi": _safe_float(rsi.iloc[-1]) if len(rsi) > 0 else None,
            "macd_line": _safe_float(macd_line.iloc[-1]) if len(macd_line) > 0 else None,
            "signal_line": _safe_float(signal_line.iloc[-1]) if len(signal_line) > 0 else None,
            "macd_histogram": _safe_float(histogram.iloc[-1]) if len(histogram) > 0 else None,
            "upper_bb": _safe_float(upper_bb.iloc[-1]) if len(upper_bb) > 0 else None,
            "middle_bb": _safe_float(middle_bb.iloc[-1]) if len(middle_bb) > 0 else None,
            "lower_bb": _safe_float(lower_bb.iloc[-1]) if len(lower_bb) > 0 else None,
        },
    }

    return result


def _sma(series: pd.Series, period: int) -> pd.Series:
    return series.rolling(window=period, min_periods=1).mean()


def _ema(series: pd.Series, period: int) -> pd.Series:
    return series.ewm(span=period, adjust=False).mean()


def _rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(window=period, min_periods=1).mean()
    avg_loss = loss.rolling(window=period, min_periods=1).mean()

    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)


def _macd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9):
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    return macd_line, signal_line, histogram


def _bollinger_bands(series: pd.Series, period: int = 20, num_std: int = 2):
    middle = series.rolling(window=period, min_periods=1).mean()
    std = series.rolling(window=period, min_periods=1).std().fillna(0)
    upper = middle + (std * num_std)
    lower = middle - (std * num_std)
    return upper, middle, lower


def _safe_float(val) -> float:
    if val is None or (isinstance(val, float) and np.isnan(val)):
        return 0.0
    return round(float(val), 4)


def _safe_series(series: pd.Series, dates) -> list:
    records = []
    values = series.values if hasattr(series, "values") else series
    date_vals = dates.values if hasattr(dates, "values") else dates

    length = min(len(values), len(date_vals))
    for i in range(length):
        v = values[i]
        d = str(pd.Timestamp(date_vals[i]).date()) if not isinstance(date_vals[i], str) else date_vals[i]
        if np.isnan(v):
            continue
        records.append({"date": d, "value": round(float(v), 4)})
    return records
