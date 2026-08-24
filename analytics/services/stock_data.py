import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


def fetch_stock_data(symbol: str, period_months: int = 6) -> pd.DataFrame:
    try:
        return _fetch_yfinance(symbol, period_months)
    except Exception as e:
        logger.warning("yfinance failed for %s: %s. Falling back to mock data.", symbol, e)
        return _generate_mock_data(symbol, period_months)


def _fetch_yfinance(symbol: str, period_months: int) -> pd.DataFrame:
    import yfinance as yf

    ticker = yf.Ticker(symbol)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=period_months * 30)

    df = ticker.history(start=start_date.strftime("%Y-%m-%d"), end=end_date.strftime("%Y-%m-%d"))

    if df is None or df.empty:
        raise ValueError(f"No data returned for symbol: {symbol}")

    df = df.reset_index()
    df = df.rename(columns={
        "Date": "date",
        "Open": "open",
        "High": "high",
        "Low": "low",
        "Close": "close",
        "Volume": "volume",
    })

    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"]).dt.tz_localize(None)

    required = ["date", "open", "high", "low", "close", "volume"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"Missing column {col} in yfinance data")

    return df[required].dropna().reset_index(drop=True)


def _generate_mock_data(symbol: str, period_months: int) -> pd.DataFrame:
    days = period_months * 30
    dates = pd.bdate_range(end=datetime.now(), periods=days)

    seed = sum(ord(c) for c in symbol)
    rng = np.random.RandomState(seed)

    base_prices = {
        "AAPL": 175, "MSFT": 370, "GOOGL": 140, "AMZN": 155,
        "TSLA": 250, "META": 350, "NVDA": 480, "JPM": 170,
    }
    base = base_prices.get(symbol.upper(), 100 + seed % 200)

    returns = rng.normal(0.0005, 0.018, size=len(dates))
    prices = base * np.cumprod(1 + returns)

    highs = prices * (1 + rng.uniform(0.005, 0.025, size=len(dates)))
    lows = prices * (1 - rng.uniform(0.005, 0.025, size=len(dates)))
    opens = lows + (highs - lows) * rng.uniform(0.2, 0.8, size=len(dates))
    volumes = rng.randint(5_000_000, 60_000_000, size=len(dates)).astype(float)

    df = pd.DataFrame({
        "date": dates,
        "open": np.round(opens, 2),
        "high": np.round(highs, 2),
        "low": np.round(lows, 2),
        "close": np.round(prices, 2),
        "volume": volumes,
    })

    return df
