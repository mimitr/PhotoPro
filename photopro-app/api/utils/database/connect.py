import psycopg2


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

connImages = psycopg2.connect(
    user=database_user,
    password=database_password,
    host=host,
    port=port,
    database=database_name,
)
curImages = connImages.cursor()


connImages2 = psycopg2.connect(
    user=database_user,
    password=database_password,
    host=host,
    port=port,
    database=database_name,
)
curImages2 = connImages2.cursor()

connLikes = psycopg2.connect(
    user=database_user,
    password=database_password,
    host=host,
    port=port,
    database=database_name,
)
curLikes = connLikes.cursor()

connPurchases = psycopg2.connect(
    user=database_user,
    password=database_password,
    host=host,
    port=port,
    database=database_name,
)
curPurchases = connPurchases.cursor()

connShoppingCart = psycopg2.connect(
    user=database_user,
    password=database_password,
    host=host,
    port=port,
    database=database_name,
)
curShoppingCart = connShoppingCart.cursor()
