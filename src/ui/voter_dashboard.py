import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime, timedelta

# --- Configuration ---
st.set_page_config(
    page_title="Voter Eligibility Dashboard - EAC",
    page_icon="🗳️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Data Simulation (Replace with actual data fetching in a real scenario) ---
@st.cache_data
def generate_dummy_data(num_months=24):
    """Generates dummy data for voter eligibility verification statistics."""
    states = ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina']
    counties_per_state = {
        'California': ['Los Angeles', 'San Diego', 'Orange', 'Riverside'],
        'Texas': ['Harris', 'Dallas', 'Tarrant', 'Bexar'],
        'Florida': ['Miami-Dade', 'Broward', 'Palm Beach', 'Orange'],
        'New York': ['Kings', 'Queens', 'New York', 'Suffolk'],
        'Pennsylvania': ['Philadelphia', 'Allegheny', 'Montgomery', 'Bucks'],
        'Ohio': ['Franklin', 'Cuyahoga', 'Hamilton', 'Summit'],
        'Georgia': ['Fulton', 'Gwinnett', 'Cobb', 'DeKalb'],
        'North Carolina': ['Wake', 'Mecklenburg', 'Guilford', 'Forsyth']
    }

    data = []
    start_date = datetime.now() - timedelta(days=30 * num_months)

    for i in range(num_months):
        current_date = start_date + timedelta(days=30 * i)
        month_year = current_date.strftime("%Y-%m")

        for state in states:
            for county in counties_per_state[state]:
                # Simulate data for each month, state, and county
                verification_successes = np.random.randint(1000, 50000)
                pending_verifications = np.random.randint(50, 5000)
                # Data correction rate as a percentage
                data_correction_rate = np.random.uniform(0.1, 5.0)

                data.append({
                    'Date': current_date,
                    'Month-Year': month_year,
                    'State': state,
                    'County': county,
                    'Verification Successes': verification_successes,
                    'Pending Verifications': pending_verifications,
                    'Data Correction Rate (%)': data_correction_rate
                })

    df = pd.DataFrame(data)
    df['Date'] = pd.to_datetime(df['Date'])
    return df

df_data = generate_dummy_data()

# --- Dashboard Header ---
st.title("🗳️ Voter Eligibility Verification Dashboard")
st.markdown("""
This public-facing dashboard provides anonymized, aggregated statistics on citizenship verification processes
for voter eligibility, as mandated by the Executive Order. Data is presented at the state or county level
to ensure the privacy of individual American citizens.
""")

st.info("Disclaimer: The data presented here is simulated for demonstration purposes only. In a live system, this would reflect real-time anonymized aggregates from federal and state databases.")

# --- Sidebar Filters ---
st.sidebar.header("Filter Data")

# State selection
all_states = ['All States'] + sorted(df_data['State'].unique().tolist())
selected_state = st.sidebar.selectbox("Select State", all_states)

# County selection (only if a specific state is selected)
if selected_state != 'All States':
    counties_in_state = ['All Counties'] + sorted(df_data[df_data['State'] == selected_state]['County'].unique().tolist())
    selected_county = st.sidebar.selectbox("Select County", counties_in_state)
else:
    selected_county = 'All Counties' # Default for 'All States'

# Date range selection
min_date = df_data['Date'].min().to_pydatetime()
max_date = df_data['Date'].max().to_pydatetime()
date_range = st.sidebar.date_input(
    "Select Date Range",
    value=(min_date, max_date),
    min_value=min_date,
    max_value=max_date
)

# Ensure date_range has two elements
if len(date_range) == 2:
    start_date_filter, end_date_filter = date_range
else:
    start_date_filter, end_date_filter = min_date, max_date # Default to full range if only one date selected

# --- Apply Filters ---
filtered_df = df_data.copy()

if selected_state != 'All States':
    filtered_df = filtered_df[filtered_df['State'] == selected_state]
if selected_county != 'All Counties':
    filtered_df = filtered_df[filtered_df['County'] == selected_county]

filtered_df = filtered_df[(filtered_df['Date'] >= pd.to_datetime(start_date_filter)) &
                         (filtered_df['Date'] <= pd.to_datetime(end_date_filter))]

# Aggregate data for display
if selected_state == 'All States' and selected_county == 'All Counties':
    # Aggregate by Month-Year for national view
    aggregated_df = filtered_df.groupby('Month-Year').agg(
        {'Verification Successes': 'sum',
         'Pending Verifications': 'sum',
         'Data Correction Rate (%)': 'mean'}
    ).reset_index().sort_values('Month-Year')
    aggregated_df['Data Correction Rate (%)'] = aggregated_df['Data Correction Rate (%)'].round(2)
    group_by_col = 'Month-Year'
elif selected_county == 'All Counties':
    # Aggregate by State and Month-Year
    aggregated_df = filtered_df.groupby(['State', 'Month-Year']).agg(
        {'Verification Successes': 'sum',
         'Pending Verifications': 'sum',
         'Data Correction Rate (%)': 'mean'}
    ).reset_index().sort_values(['State', 'Month-Year'])
    aggregated_df['Data Correction Rate (%)'] = aggregated_df['Data Correction Rate (%)'].round(2)
    group_by_col = 'Month-Year'
else:
    # Aggregate by County and Month-Year
    aggregated_df = filtered_df.groupby(['State', 'County', 'Month-Year']).agg(
        {'Verification Successes': 'sum',
         'Pending Verifications': 'sum',
         'Data Correction Rate (%)': 'mean'}
    ).reset_index().sort_values(['State', 'County', 'Month-Year'])
    aggregated_df['Data Correction Rate (%)'] = aggregated_df['Data Correction Rate (%)'].round(2)
    group_by_col = 'Month-Year'


st.subheader(f"Verification Statistics for {selected_county if selected_county != 'All Counties' else selected_state} ({start_date_filter.strftime('%Y-%m-%d')} to {end_date_filter.strftime('%Y-%m-%d')})")

if aggregated_df.empty:
    st.warning("No data available for the selected filters.")
else:
    # --- Key Metrics ---
    st.markdown("---")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric(label="Total Verification Successes", value=f"{aggregated_df['Verification Successes'].sum():,}")
    with col2:
        st.metric(label="Total Pending Verifications", value=f"{aggregated_df['Pending Verifications'].sum():,}")
    with col3:
        st.metric(label="Average Data Correction Rate", value=f"{aggregated_df['Data Correction Rate (%)'].mean():.2f}%")
    st.markdown("---")

    # --- Charts ---
    st.subheader("Trends Over Time")

    # Verification Successes Trend
    fig_success = px.line(
        aggregated_df,
        x=group_by_col,
        y='Verification Successes',
        title='Monthly Verification Successes',
        labels={'Verification Successes': 'Number of Successes', group_by_col: 'Month-Year'},
        hover_data=['Verification Successes', 'Pending Verifications', 'Data Correction Rate (%)']
    )
    fig_success.update_traces(mode='lines+markers')
    st.plotly_chart(fig_success, use_container_width=True)

    # Pending Verifications Trend
    fig_pending = px.line(
        aggregated_df,
        x=group_by_col,
        y='Pending Verifications',
        title='Monthly Pending Verifications',
        labels={'Pending Verifications': 'Number of Pending', group_by_col: 'Month-Year'},
        color_discrete_sequence=px.colors.qualitative.Pastel
    )
    fig_pending.update_traces(mode='lines+markers')
    st.plotly_chart(fig_pending, use_container_width=True)

    # Data Correction Rate Trend
    fig_correction = px.line(
        aggregated_df,
        x=group_by_col,
        y='Data Correction Rate (%)',
        title='Monthly Average Data Correction Rate',
        labels={'Data Correction Rate (%)': 'Correction Rate (%)', group_by_col: 'Month-Year'},
        color_discrete_sequence=px.colors.qualitative.Set2
    )
    fig_correction.update_traces(mode='lines+markers')
    st.plotly_chart(fig_correction, use_container_width=True)

    # --- Raw Data Table ---
    st.subheader("Aggregated Data Table")
    st.dataframe(aggregated_df, use_container_width=True)

# --- Footer ---
st.markdown("---")
st.markdown("""
<small>
This dashboard is established by the Election Assistance Commission (EAC) in accordance with Section 18.0 of the Executive Order:
SAFEGUARDING AMERICAN VOTER ELIGIBILITY AND ESTABLISHING THE MILITARY FUND.
</small>
""", unsafe_allow_html=True)