import psycopg2

def get_conn_and_cur():
    port = 5432
    host = "34.87.239.111"
    database_user = "outside_user"
    database_password = "outside_user"
    database_name = "postgres"

    conn = psycopg2.connect(
        user=database_user,
        password=database_password,
        host=host,
        port=port,
        database=database_name,
    )
    cur = conn.cursor()
    return conn, cur
