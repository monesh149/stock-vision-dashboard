from flask import Flask, jsonify, request
from flask_cors import CORS
from services.stock_data import fetch_stock_data
from services.indicators import calculate_indicators
from services.signals import generate_signal

app = Flask(__name__)
CORS(app)


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "stockvision-analytics"})


@app.route("/api/analytics/<symbol>", methods=["GET"])
def get_analytics(symbol: str):
    symbol = symbol.upper().strip()
    if not symbol:
        return jsonify({"error": "Symbol is required"}), 400

    try:
        df = fetch_stock_data(symbol)
        indicators = calculate_indicators(df)
        signal = generate_signal(indicators)

        return jsonify({
            "symbol": symbol,
            "indicators": indicators,
            "signal": signal,
        })
    except Exception as e:
        return jsonify({"error": f"Failed to fetch analytics for {symbol}: {str(e)}"}), 500


@app.route("/api/analytics/<symbol>/indicators", methods=["GET"])
def get_indicators(symbol: str):
    symbol = symbol.upper().strip()
    if not symbol:
        return jsonify({"error": "Symbol is required"}), 400

    try:
        df = fetch_stock_data(symbol)
        indicators = calculate_indicators(df)

        return jsonify({
            "symbol": symbol,
            "indicators": indicators,
        })
    except Exception as e:
        return jsonify({"error": f"Failed to fetch indicators for {symbol}: {str(e)}"}), 500


@app.route("/api/analytics/<symbol>/signal", methods=["GET"])
def get_signal(symbol: str):
    symbol = symbol.upper().strip()
    if not symbol:
        return jsonify({"error": "Symbol is required"}), 400

    try:
        df = fetch_stock_data(symbol)
        indicators = calculate_indicators(df)
        signal = generate_signal(indicators)

        return jsonify({
            "symbol": symbol,
            "signal": signal,
        })
    except Exception as e:
        return jsonify({"error": f"Failed to generate signal for {symbol}: {str(e)}"}), 500


@app.route("/api/analytics/compare", methods=["POST"])
def compare_stocks():
    body = request.get_json(silent=True)
    if not body or "symbols" not in body:
        return jsonify({"error": "Request body must contain a 'symbols' array"}), 400

    symbols = body["symbols"]
    if not isinstance(symbols, list) or len(symbols) == 0:
        return jsonify({"error": "'symbols' must be a non-empty array"}), 400

    if len(symbols) > 10:
        return jsonify({"error": "Cannot compare more than 10 stocks at once"}), 400

    results = []
    errors = []

    for sym in symbols:
        sym = sym.upper().strip()
        if not sym:
            continue
        try:
            df = fetch_stock_data(sym)
            indicators = calculate_indicators(df)
            signal = generate_signal(indicators)

            results.append({
                "symbol": sym,
                "current_price": indicators["latest"].get("sma_20"),
                "rsi": indicators["latest"].get("rsi"),
                "macd": indicators["latest"].get("macd_line"),
                "signal": signal,
                "statistics": indicators.get("statistics", {}),
            })
        except Exception as e:
            errors.append({"symbol": sym, "error": str(e)})

    return jsonify({
        "results": results,
        "errors": errors,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
