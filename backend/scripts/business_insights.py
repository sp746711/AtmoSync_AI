from __future__ import annotations

import json
import logging
import logging.config
from typing import Any

import numpy as np
import pandas as pd

from backend.config.config import (
    EXECUTIVE_SUMMARY_CSV,
    BUSINESS_INSIGHTS_CSV,
    FINANCIAL_SUMMARY_CSV,
    FINAL_DASHBOARD_DATA_CSV,
    LOGGER_NAME,
    build_production_logging_config,
)

from backend.config.business_rules import (
    INSURANCE_THRESHOLD_LOSS_FRACTION,
    RECOVERY_THRESHOLD_LOSS_FRACTION,
)



def setup_logging() -> logging.Logger:
    """Configure production logging for business insights."""

    logging.config.dictConfig(build_production_logging_config())
    return logging.getLogger(LOGGER_NAME)


def load_dataset() -> pd.DataFrame:
    """Load final dashboard dataset used for generating insights."""

    logger = logging.getLogger(LOGGER_NAME)
    if not FINAL_DASHBOARD_DATA_CSV.exists():
        raise FileNotFoundError(
            f"Final dashboard dataset not found: {FINAL_DASHBOARD_DATA_CSV}"
        )

    logger.info(
        "Loading final dashboard dataset from %s", str(FINAL_DASHBOARD_DATA_CSV)
    )
    return pd.read_csv(FINAL_DASHBOARD_DATA_CSV)


def _require_columns(df: pd.DataFrame, required: list[str]) -> None:
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in input dataset: {missing}")


def _coerce_numeric(df: pd.DataFrame, col: str) -> pd.Series:
    if col not in df.columns:
        return pd.Series([pd.NA] * len(df), dtype="float64")
    return pd.to_numeric(df[col], errors="coerce")


def _safe_str_mode(s: pd.Series) -> str:
    if s.empty:
        return ""
    s2 = s.dropna().astype(str)
    if s2.empty:
        return ""
    return str(s2.mode().iloc[0])


def _top_n(df: pd.DataFrame, group_col: str, value_col: str, n: int = 5) -> pd.DataFrame:
    if group_col not in df.columns:
        return pd.DataFrame(columns=[group_col, value_col])
    if value_col not in df.columns:
        return pd.DataFrame(columns=[group_col, value_col])

    g = (
        df.groupby(group_col, dropna=False)[value_col]
        .sum(min_count=1)
        .sort_values(ascending=False)
        .head(n)
        .reset_index()
    )
    return g


def generate_dashboard_kpis(df: pd.DataFrame) -> pd.DataFrame:
    """Generate management KPIs for Power BI / dashboards."""

    logger = logging.getLogger(LOGGER_NAME)

    # Shipment/Product scope assumptions:
    # - Shipment ID is used as the shipment grain.
    # - Product Name / Category are used as descriptive dimensions.
    required = [
        "Shipment ID",
        "Product Category",
        "Product Name",
        "Vehicle Type",
        "Transport Mode",
        "Origin City",
        "Destination City",
        "Temperature",
        "Humidity",
        "Battery",
        "Delay Hours",
        "Risk Score",
    ]
    _require_columns(df, [c for c in required if c in df.columns] + [])

    total_shipments = (
        df["Shipment ID"].nunique() if "Shipment ID" in df.columns else len(df)
    )
    total_products = (
        df["Product Name"].nunique() if "Product Name" in df.columns else 0
    )

    inventory_value = _coerce_numeric(df, "Inventory Value")
    total_inventory_value = float(inventory_value.fillna(0.0).sum())

    financial_loss = _coerce_numeric(df, "Financial Loss")
    total_estimated_financial_loss = float(financial_loss.fillna(0.0).sum())

    spoiled_quantity = _coerce_numeric(df, "Spoiled Quantity")
    total_spoiled_quantity = float(spoiled_quantity.fillna(0.0).sum())

    avg_temperature = float(_coerce_numeric(df, "Temperature").mean(skipna=True))
    avg_humidity = float(_coerce_numeric(df, "Humidity").mean(skipna=True))
    avg_battery = float(_coerce_numeric(df, "Battery").mean(skipna=True))
    avg_delay_hours = float(_coerce_numeric(df, "Delay Hours").mean(skipna=True))
    avg_risk_score = float(_coerce_numeric(df, "Risk Score").mean(skipna=True))

    risk_score = _coerce_numeric(df, "Risk Score")
    highest_risk_idx = risk_score.fillna(-1).idxmax() if len(df) else None
    highest_risk_shipment = (
        str(df.loc[highest_risk_idx, "Shipment ID"]) if highest_risk_idx is not None else ""
    )

    highest_fin_loss_idx = financial_loss.fillna(-1).idxmax() if len(df) else None
    highest_fin_loss_shipment = (
        str(df.loc[highest_fin_loss_idx, "Shipment ID"]) if highest_fin_loss_idx is not None else ""
    )

    highest_spoil_idx = spoiled_quantity.fillna(-1).idxmax() if len(df) else None
    highest_spoil_shipment = (
        str(df.loc[highest_spoil_idx, "Shipment ID"]) if highest_spoil_idx is not None else ""
    )

    insurance_eligible = df.get("Insurance Eligible")
    recovery_eligible = df.get("Recovery Eligible")

    if insurance_eligible is None:
        insurance_eligible_count = 0
    else:
        insurance_eligible_count = int(pd.to_numeric(insurance_eligible, errors="coerce").fillna(0).astype(bool).sum())

    if recovery_eligible is None:
        recovery_eligible_count = 0
    else:
        recovery_eligible_count = int(pd.to_numeric(recovery_eligible, errors="coerce").fillna(0).astype(bool).sum())

    risk_category = df.get("Risk Category")
    critical_count = int((risk_category.astype(str) == "Critical Risk").sum()) if risk_category is not None else 0
    high_count = int((risk_category.astype(str) == "High Risk").sum()) if risk_category is not None else 0
    medium_count = int((risk_category.astype(str) == "Medium Risk").sum()) if risk_category is not None else 0
    low_count = int((risk_category.astype(str) == "Low Risk").sum()) if risk_category is not None else 0

    temp_exc = _coerce_numeric(df, "Temperature Excursion Flag")
    hum_exc = _coerce_numeric(df, "Humidity Excursion Flag")
    battery_low = _coerce_numeric(df, "Battery Low Flag")
    delay_flag = _coerce_numeric(df, "Delay Flag")

    temperature_excs = int((temp_exc.fillna(0.0) > 0).sum())
    humidity_excs = int((hum_exc.fillna(0.0) > 0).sum())
    battery_issues = int((battery_low.fillna(0.0) > 0).sum())
    delay_issues = int((delay_flag.fillna(0.0) > 0).sum())

    top_product_category = _safe_str_mode(df.get("Product Category", pd.Series(dtype=object)))
    top_product = _safe_str_mode(df.get("Product Name", pd.Series(dtype=object)))
    top_vehicle_type = _safe_str_mode(df.get("Vehicle Type", pd.Series(dtype=object)))
    top_transport_mode = _safe_str_mode(df.get("Transport Mode", pd.Series(dtype=object)))
    top_origin_city = _safe_str_mode(df.get("Origin City", pd.Series(dtype=object)))
    top_destination_city = _safe_str_mode(df.get("Destination City", pd.Series(dtype=object)))

    kpis: list[dict[str, Any]] = [
        {"KPI": "Total Shipments", "Value": total_shipments},
        {"KPI": "Total Products", "Value": total_products},
        {"KPI": "Total Inventory Value", "Value": total_inventory_value},
        {"KPI": "Total Estimated Financial Loss", "Value": total_estimated_financial_loss},
        {"KPI": "Total Spoiled Quantity", "Value": total_spoiled_quantity},
        {"KPI": "Average Temperature", "Value": avg_temperature},
        {"KPI": "Average Humidity", "Value": avg_humidity},
        {"KPI": "Average Battery", "Value": avg_battery},
        {"KPI": "Average Delay Hours", "Value": avg_delay_hours},
        {"KPI": "Average Risk Score", "Value": avg_risk_score},
        {"KPI": "Highest Risk Shipment", "Value": highest_risk_shipment},
        {"KPI": "Highest Financial Loss Shipment", "Value": highest_fin_loss_shipment},
        {"KPI": "Highest Spoilage Shipment", "Value": highest_spoil_shipment},
        {"KPI": "Insurance Eligible Shipments", "Value": insurance_eligible_count},
        {"KPI": "Recovery Eligible Shipments", "Value": recovery_eligible_count},
        {"KPI": "Critical Shipments", "Value": critical_count},
        {"KPI": "High Risk Shipments", "Value": high_count},
        {"KPI": "Medium Risk Shipments", "Value": medium_count},
        {"KPI": "Low Risk Shipments", "Value": low_count},
        {"KPI": "Temperature Excursions", "Value": temperature_excs},
        {"KPI": "Humidity Excursions", "Value": humidity_excs},
        {"KPI": "Battery Issues", "Value": battery_issues},
        {"KPI": "Delay Issues", "Value": delay_issues},
        {"KPI": "Top Product Category", "Value": top_product_category},
        {"KPI": "Top Product", "Value": top_product},
        {"KPI": "Top Vehicle Type", "Value": top_vehicle_type},
        {"KPI": "Top Transport Mode", "Value": top_transport_mode},
        {"KPI": "Top Origin City", "Value": top_origin_city},
        {"KPI": "Top Destination City", "Value": top_destination_city},
    ]

    logger.info("Generated %d dashboard KPIs", len(kpis))
    return pd.DataFrame(kpis)


def generate_business_insights(df: pd.DataFrame) -> pd.DataFrame:
    """Generate narrative business insights and summary tables."""

    logger = logging.getLogger(LOGGER_NAME)

    # Loss/risk categories
    loss_cat = df.get("Loss Category")
    fin_loss = _coerce_numeric(df, "Financial Loss")

    if loss_cat is not None and "Loss Category" in df.columns:
        loss_cat_tbl = (
            df.assign(_financial_loss=fin_loss)
            .groupby("Loss Category", dropna=False)["_financial_loss"]
            .sum(min_count=1)
            .sort_values(ascending=False)
            .reset_index()
            .rename(columns={"_financial_loss": "Total Financial Loss"})
        )
        highest_loss_category = (
            str(loss_cat_tbl.iloc[0]["Loss Category"]) if not loss_cat_tbl.empty else ""
        )
    else:
        loss_cat_tbl = pd.DataFrame(columns=["Loss Category", "Total Financial Loss"])
        highest_loss_category = ""

    risk_cat = df.get("Risk Category")
    risk_score = _coerce_numeric(df, "Risk Score")
    if risk_cat is not None and "Risk Category" in df.columns:
        risk_cat_tbl = (
            df.assign(_risk_score=risk_score)
            .groupby("Risk Category", dropna=False)["_risk_score"]
            .mean()
            .reset_index()
            .rename(columns={"_risk_score": "Average Risk Score"})
        )
    else:
        risk_cat_tbl = pd.DataFrame(columns=["Risk Category", "Average Risk Score"])

    # Most delayed route (route id or city-route)
    if "Route ID" in df.columns:
        delay_tbl = _top_n(df.assign(_delay= _coerce_numeric(df, "Delay Hours")), "Route ID", "_delay", n=5)
        most_delayed_route = str(delay_tbl.iloc[0]["Route ID"]) if not delay_tbl.empty else ""
    else:
        route_key = "(Origin City -> Destination City)"
        tmp = df.copy()
        tmp[route_key] = tmp["Origin City"].astype(str) + " -> " + tmp["Destination City"].astype(str)
        delay_tbl = (
            tmp.assign(_delay=_coerce_numeric(tmp, "Delay Hours"))
            .groupby(route_key, dropna=False)["_delay"]
            .sum(min_count=1)
            .sort_values(ascending=False)
            .head(5)
            .reset_index()
            .rename(columns={"_delay": "Total Delay Hours"})
        )
        most_delayed_route = str(delay_tbl.iloc[0][route_key]) if not delay_tbl.empty else ""

    most_affected_product = str(_top_n(df, "Product Name", "Spoiled Quantity", n=1).iloc[0]["Product Name"]) if "Spoiled Quantity" in df.columns and not _top_n(df, "Product Name", "Spoiled Quantity", n=1).empty else ""

    city_tbl = _top_n(df, "Origin City", "Spoiled Quantity", n=5)
    most_affected_city = str(city_tbl.iloc[0]["Origin City"]) if not city_tbl.empty else ""

    transport_tbl = _top_n(df, "Transport Mode", "Spoiled Quantity", n=5)
    most_affected_transport_mode = str(transport_tbl.iloc[0]["Transport Mode"]) if not transport_tbl.empty else ""

    # Top insurance claims & recovery opportunities
    insurance_claim = _coerce_numeric(df, "Insurance Claim Amount")
    if "Insurance Claim Amount" in df.columns:
        insurance_claim_tbl = (
            df.assign(_claim=insurance_claim)
            .groupby(["Origin City", "Destination City"], dropna=False)["_claim"]
            .sum(min_count=1)
            .sort_values(ascending=False)
            .head(10)
            .reset_index()
            .rename(columns={"_claim": "Total Insurance Claim Amount"})
        )
        top_insurance_claims = insurance_claim_tbl.head(5)
    else:
        insurance_claim_tbl = pd.DataFrame()
        top_insurance_claims = pd.DataFrame()

    recovery_amount = _coerce_numeric(df, "Recovery Amount")
    if "Recovery Amount" in df.columns:
        recovery_tbl = (
            df.assign(_recovery=recovery_amount)
            .groupby(["Origin City", "Destination City"], dropna=False)["_recovery"]
            .sum(min_count=1)
            .sort_values(ascending=False)
            .head(10)
            .reset_index()
            .rename(columns={"_recovery": "Total Recovery Amount"})
        )
        recovery_opportunities = recovery_tbl.head(5)
    else:
        recovery_opportunities = pd.DataFrame()

    compliance_flag = _coerce_numeric(df, "Cold Chain Compliance Flag")
    cold_chain_compliance_rate = float((compliance_flag.fillna(0.0) > 0).mean() * 100.0) if len(df) else 0.0

    # Business health: combine risk and financial loss intensity.
    financial_loss_total = fin_loss.fillna(0.0).sum()
    inventory_total = _coerce_numeric(df, "Inventory Value").fillna(0.0).sum()
    loss_fraction = float(financial_loss_total / (inventory_total + 1e-9)) if inventory_total > 0 else 0.0

    # Risk distribution
    risk_counts = (
        df["Risk Category"].value_counts(dropna=False).to_dict()
        if "Risk Category" in df.columns
        else {}
    )

    # Convert some structured insights to strings for CSV friendliness.
    def _json_safe(obj: Any) -> str:
        try:
            return json.dumps(obj, ensure_ascii=False)
        except TypeError:
            return str(obj)

    insights_rows: list[dict[str, Any]] = [
        {"Insight": "Highest loss category", "Value": highest_loss_category},
        {"Insight": "Most delayed route", "Value": most_delayed_route},
        {"Insight": "Most affected product", "Value": most_affected_product},
        {"Insight": "Most affected city", "Value": most_affected_city},
        {"Insight": "Most affected transport mode", "Value": most_affected_transport_mode},
        {
            "Insight": "Top insurance claims (Origin->Destination)",
            "Value": _json_safe(top_insurance_claims.to_dict(orient="records"))
            if not top_insurance_claims.empty
            else "[]",
        },
        {
            "Insight": "Recovery opportunities (Origin->Destination)",
            "Value": _json_safe(recovery_opportunities.to_dict(orient="records"))
            if not recovery_opportunities.empty
            else "[]",
        },
        {"Insight": "Operational performance (Cold chain compliance %)", "Value": cold_chain_compliance_rate},
        {"Insight": "Business health (Loss fraction of inventory)", "Value": loss_fraction},
        {"Insight": "Risk distribution", "Value": _json_safe(risk_counts)},
        {
            "Insight": "Insurance threshold (Loss fraction)",
            "Value": INSURANCE_THRESHOLD_LOSS_FRACTION,
        },
        {
            "Insight": "Recovery threshold (Loss fraction)",
            "Value": RECOVERY_THRESHOLD_LOSS_FRACTION,
        },
    ]

    logger.info("Generated %d business insight rows", len(insights_rows))
    return pd.DataFrame(insights_rows)


def generate_financial_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate financial analytics summary tables."""

    logger = logging.getLogger(LOGGER_NAME)

    inventory_value = _coerce_numeric(df, "Inventory Value")
    financial_loss = _coerce_numeric(df, "Financial Loss")
    spoiled_qty = _coerce_numeric(df, "Spoiled Quantity")
    insurance_claim = _coerce_numeric(df, "Insurance Claim Amount")
    recovery_amount = _coerce_numeric(df, "Recovery Amount")
    net_financial_loss = _coerce_numeric(df, "Net Financial Loss")

    inventory_total = float(inventory_value.fillna(0.0).sum())
    financial_loss_total = float(financial_loss.fillna(0.0).sum())
    net_financial_loss_total = float(net_financial_loss.fillna(0.0).sum())
    insurance_claim_total = float(insurance_claim.fillna(0.0).sum())
    recovery_amount_total = float(recovery_amount.fillna(0.0).sum())

    if inventory_total > 0:
        loss_pct = financial_loss_total / inventory_total
        net_loss_pct = net_financial_loss_total / inventory_total
    else:
        loss_pct = 0.0
        net_loss_pct = 0.0

    # Breakdown by Loss Category
    if "Loss Category" in df.columns:
        loss_category_tbl = (
            df.assign(_inventory=inventory_value, _loss=financial_loss, _net=net_financial_loss)
            .groupby("Loss Category", dropna=False)
            .agg(
                TotalInventoryValue=("_inventory", "sum"),
                TotalFinancialLoss=("_loss", "sum"),
                TotalNetFinancialLoss=("_net", "sum"),
            )
            .reset_index()
            .sort_values("TotalFinancialLoss", ascending=False)
        )
    else:
        loss_category_tbl = pd.DataFrame()

    # Best recovery leverages (recovery eligible routes)
    if "Recovery Eligible" in df.columns and not df.empty:
        eligible_routes = (
            df.assign(_recovery=recovery_amount)
            .groupby(["Origin City", "Destination City"], dropna=False)["_recovery"]
            .sum(min_count=1)
            .sort_values(ascending=False)
            .head(10)
            .reset_index()
            .rename(columns={"_recovery": "Total Recovery Amount"})
        )
    else:
        eligible_routes = pd.DataFrame()

    rows: list[dict[str, Any]] = [
        {"Metric": "Total Inventory Value", "Value": inventory_total},
        {"Metric": "Total Financial Loss", "Value": financial_loss_total},
        {"Metric": "Loss % of Inventory", "Value": loss_pct},
        {"Metric": "Total Net Financial Loss", "Value": net_financial_loss_total},
        {"Metric": "Net Loss % of Inventory", "Value": net_loss_pct},
        {"Metric": "Total Insurance Claim Amount", "Value": insurance_claim_total},
        {"Metric": "Total Recovery Amount", "Value": recovery_amount_total},
        {"Metric": "Total Spoiled Quantity", "Value": float(spoiled_qty.fillna(0.0).sum())},
    ]

    logger.info("Generated financial summary metrics")

    summary_df = pd.DataFrame(rows)

    # Append JSON tables as rows for single-CSV consumption.
    def _json_safe(obj: Any) -> str:
        try:
            return json.dumps(obj, ensure_ascii=False)
        except TypeError:
            return str(obj)

    if not loss_category_tbl.empty:
        summary_df.loc[len(summary_df)] = {
            "Metric": "Loss Category Breakdown",
            "Value": _json_safe(loss_category_tbl.to_dict(orient="records")),
        }

    if not eligible_routes.empty:
        summary_df.loc[len(summary_df)] = {
            "Metric": "Top Recovery Opportunities (Origin->Destination)",
            "Value": _json_safe(eligible_routes.to_dict(orient="records")),
        }

    return summary_df


def generate_operational_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate operational analytics insights."""

    logger = logging.getLogger(LOGGER_NAME)

    avg_delay = float(_coerce_numeric(df, "Delay Hours").mean(skipna=True)) if len(df) else 0.0

    temp_exc = _coerce_numeric(df, "Temperature Excursion Flag")
    hum_exc = _coerce_numeric(df, "Humidity Excursion Flag")
    battery_low = _coerce_numeric(df, "Battery Low Flag")
    delay_flag = _coerce_numeric(df, "Delay Flag")

    temperature_compliance_rate = float(1.0 - (temp_exc.fillna(0.0) > 0).mean()) * 100.0 if len(df) else 0.0
    humidity_compliance_rate = float(1.0 - (hum_exc.fillna(0.0) > 0).mean()) * 100.0 if len(df) else 0.0
    battery_health_rate = float(1.0 - (battery_low.fillna(0.0) > 0).mean()) * 100.0 if len(df) else 0.0
    delay_compliance_rate = float(1.0 - (delay_flag.fillna(0.0) > 0).mean()) * 100.0 if len(df) else 0.0

    # Most delayed route dimension.
    if "Route ID" in df.columns:
        by_route = (
            df.assign(_delay=_coerce_numeric(df, "Delay Hours"))
            .groupby("Route ID", dropna=False)["_delay"]
            .sum(min_count=1)
            .sort_values(ascending=False)
            .head(1)
        )
        most_delayed = str(by_route.index[0]) if not by_route.empty else ""
    else:
        route_key = "(Origin City -> Destination City)"
        tmp = df.copy()
        tmp[route_key] = tmp["Origin City"].astype(str) + " -> " + tmp["Destination City"].astype(str)
        by_route = (
            tmp.assign(_delay=_coerce_numeric(tmp, "Delay Hours"))
            .groupby(route_key, dropna=False)["_delay"]
            .sum(min_count=1)
            .sort_values(ascending=False)
            .head(1)
        )
        most_delayed = str(by_route.index[0]) if not by_route.empty else ""

    rows: list[dict[str, Any]] = [
        {"Metric": "Average Delay Hours", "Value": avg_delay},
        {"Metric": "Temperature Compliance Rate (%)", "Value": temperature_compliance_rate},
        {"Metric": "Humidity Compliance Rate (%)", "Value": humidity_compliance_rate},
        {"Metric": "Battery Health Rate (%)", "Value": battery_health_rate},
        {"Metric": "Delay Compliance Rate (%)", "Value": delay_compliance_rate},
        {"Metric": "Most Delayed Route", "Value": most_delayed},
    ]

    logger.info("Generated operational summary")
    return pd.DataFrame(rows)


def generate_quality_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Generate quality analytics based on excursion flags and risk."""

    logger = logging.getLogger(LOGGER_NAME)

    temp_exc_rate = float((_coerce_numeric(df, "Temperature Excursion Flag").fillna(0.0) > 0).mean() * 100.0) if len(df) else 0.0
    hum_exc_rate = float((_coerce_numeric(df, "Humidity Excursion Flag").fillna(0.0) > 0).mean() * 100.0) if len(df) else 0.0

    # Highest risk product/category.
    if "Risk Category" in df.columns:
        highest_risk_category = str(df["Risk Category"].value_counts(dropna=False).idxmax())
    else:
        highest_risk_category = ""

    affected_products = (
        df.assign(_spoiled=_coerce_numeric(df, "Spoiled Quantity"))
        .groupby("Product Name", dropna=False)["_spoiled"]
        .sum(min_count=1)
        .sort_values(ascending=False)
        .head(5)
        .reset_index()
        .rename(columns={"_spoiled": "Total Spoiled Quantity"})
    )

    rows: list[dict[str, Any]] = [
        {"Metric": "Temperature Excursion Rate (%)", "Value": temp_exc_rate},
        {"Metric": "Humidity Excursion Rate (%)", "Value": hum_exc_rate},
        {"Metric": "Highest Risk Category (by count)", "Value": highest_risk_category},
        {
            "Metric": "Top Affected Products (by spoiled quantity)",
            "Value": affected_products.to_json(orient="records", force_ascii=False),
        },
    ]

    logger.info("Generated quality summary")
    return pd.DataFrame(rows)


def generate_executive_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Create executive summaries suitable for multiple stakeholder views."""

    logger = logging.getLogger(LOGGER_NAME)

    kpis = generate_dashboard_kpis(df)
    business_insights = generate_business_insights(df)

    # Derive a couple of high-level sentences.
    avg_risk = float(kpis.loc[kpis["KPI"] == "Average Risk Score", "Value"].iloc[0]) if not kpis.empty else 0.0
    total_loss = float(kpis.loc[kpis["KPI"] == "Total Estimated Financial Loss", "Value"].iloc[0]) if not kpis.empty else 0.0
    compliance_flag = _coerce_numeric(df, "Cold Chain Compliance Flag")
    compliance_rate = float((compliance_flag.fillna(0.0) > 0).mean() * 100.0) if len(df) else 0.0

    executive_notes: dict[str, str] = {
        "CEO": (
            "AtmoSync AI indicates overall business exposure driven by cold-chain compliance gaps. "
            f"Average risk score is {avg_risk:.2f}/100, with total estimated financial loss of {total_loss:,.2f}. "
            f"Cold-chain compliance is {compliance_rate:.1f}% across monitored records."
        ),
        "Operations Manager": (
            "Operational performance is primarily affected by excursions and delay events. "
            "Prioritize route-level investigations for delayed lanes and sensor health interventions. "
            "Use the dashboard KPIs to target temperature, humidity, battery, and delay issues."
        ),
        "Supply Chain Manager": (
            "Supply chain health depends on maintaining stable temperature/humidity and reducing shipment delays. "
            "Focus on the most affected products, lanes, and transport modes surfaced in the insights outputs. "
            "Leverage insurance and recovery eligibility thresholds to manage financial risk."
        ),
        "Quality Manager": (
            "Quality outcomes are directly tied to temperature and humidity excursion rates. "
            "Perform targeted quality inspections for the most affected product categories and top risk shipments. "
            "Track cold chain compliance trends to reduce spoilage risk."
        ),
        "Business Analyst": (
            "Financial and operational analytics show where loss concentrates. "
            "Review loss category breakdowns, net financial loss, and recovery opportunities to "
            "support decision-making and KPI monitoring."
        ),
        "Power BI Dashboard": (
            "Dashboard KPIs, executive summary bullets, and financial summaries have been exported "
            "to CSV for direct ingestion into Power BI. Use Power BI visuals to validate trends across risk tiers, "
            "transport modes, and routes."
        ),
    }

    rows = [{"Stakeholder": k, "Executive Summary": v} for k, v in executive_notes.items()]

    # Include a compact JSON blob with top business insights.
    def _json_safe(obj: Any) -> str:
        try:
            return json.dumps(obj, ensure_ascii=False)
        except TypeError:
            return str(obj)

    if not business_insights.empty:
        rows.append(
            {
                "Stakeholder": "Business Insight Payload",
                "Executive Summary": _json_safe(
                    business_insights.head(25).to_dict(orient="records")
                ),
            }
        )

    logger.info("Generated executive summary")
    return pd.DataFrame(rows)


def save_reports(
    executive_summary: pd.DataFrame,
    business_insights: pd.DataFrame,
    financial_summary: pd.DataFrame,
) -> None:
    """Save all report CSV outputs."""

    for path, df in [
        (EXECUTIVE_SUMMARY_CSV, executive_summary),
        (BUSINESS_INSIGHTS_CSV, business_insights),
        (FINANCIAL_SUMMARY_CSV, financial_summary),
    ]:
        path.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(path, index=False)
        logging.getLogger(LOGGER_NAME).info(
            "Saved report (%d rows, %d cols) -> %s",
            len(df),
            len(df.columns),
            str(path),
        )


def business_insights_pipeline() -> None:
    """Run the full business insights generation pipeline."""

    logger = setup_logging()
    logger.info("Starting business_insights pipeline")

    df = load_dataset()

    required_min_cols = [
        "Shipment ID",
        "Product Name",
        "Product Category",
        "Vehicle Type",
        "Transport Mode",
        "Origin City",
        "Destination City",
        "Temperature",
        "Humidity",
        "Battery",
        "Delay Hours",
        "Risk Score",
    ]
    missing_min = [c for c in required_min_cols if c not in df.columns]
    if missing_min:
        raise ValueError(
            f"Final dataset is missing required columns for business insights: {missing_min}"
        )

    executive_summary = generate_executive_summary(df)
    business_insights = generate_business_insights(df)
    financial_summary = generate_financial_summary(df)

    # Add operational and quality summary payloads into business_insights CSV.
    operational_summary = generate_operational_summary(df)
    quality_summary = generate_quality_summary(df)

    def _json_safe(obj: Any) -> str:
        try:
            return json.dumps(obj, ensure_ascii=False)
        except TypeError:
            return str(obj)

    if not operational_summary.empty:
        business_insights.loc[len(business_insights)] = {
            "Insight": "Operational Summary (CSV payload)",
            "Value": _json_safe(operational_summary.to_dict(orient="records")),
        }

    if not quality_summary.empty:
        business_insights.loc[len(business_insights)] = {
            "Insight": "Quality Summary (CSV payload)",
            "Value": _json_safe(quality_summary.to_dict(orient="records")),
        }

    save_reports(executive_summary, business_insights, financial_summary)

    logger.info("business_insights pipeline completed")


def main() -> None:
    """CLI entry point."""

    business_insights_pipeline()


if __name__ == "__main__":
    main()

