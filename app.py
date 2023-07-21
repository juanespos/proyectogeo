import os
import psycopg2
from flask import Flask, render_template, url_for, redirect
from dotenv import load_dotenv
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'thisisasecretkey'
bcrypt = Bcrypt(app)
load_dotenv()
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# creating the user class


# Devuelve el usuario que está loggeado

class User(UserMixin):
    pass


@login_manager.user_loader
def load_user(user_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """select id from usuarios where id = %s;""",
                (user_id,)
            )
            user = User()
            user.id = str(cursor.fetchone()[0])
            return user


class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=20)], render_kw={"placeholder": "Nombre de usuario"})

    password = PasswordField(validators=[InputRequired(), Length(
        min=6, max=20)], render_kw={"placeholder": "Contraseña"})

    tipo_usuario = SelectField(validators=[InputRequired(), Length(
        min=0, max=20)], choices=[('Administrador'), ('Usuario'),], option_widget=None, render_kw={"placeholder": "Tipo de usuario"})

    submit = SubmitField('Registrarse')

    def validar_usuario(self, username):
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """select %s = ANY(select username from usuarios) as existe;""", (username,))
                existing_user_username = cursor.fetchone()[0]
                if existing_user_username:
                    raise ValidationError(
                        'El usuario ya existe, escoja otro nombre de usuario')
        # return existing_user_username


class LoginForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Nombre de usuario"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=6, max=20)], render_kw={"placeholder": "Contraseña"})

    submit = SubmitField('Ingresar')


@app.route('/', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """select %s = ANY(select username from usuarios) as existe;""", (form.username.data,))
                user = cursor.fetchone()[0]
                if user:
                    cursor.execute(
                        """select md5(%s)=password is_active from usuarios where username = %s;""",
                        (form.password.data, form.username.data,)
                    )
                    coincidir_password = cursor.fetchone()[0]
                    if coincidir_password:
                        cursor.execute(
                            """select id::text,tipo_usuario::text from usuarios where username =%s;""", (form.username.data,))
                        id_user = cursor.fetchone()[0]
                        cursor.execute(
                            """select tipo_usuario::text from usuarios where username =%s;""", (form.username.data,))
                        type_user = cursor.fetchone()[0]
                        usuario = User()
                        usuario.id = str(id_user)
                        login_user(usuario)
                        if type_user == "Administrador":
                            return redirect(url_for('ofertas_admin'))
                        else: 
                            return redirect(url_for('ofertas_user'))

    return render_template('login.html', form=form)


@app.route('/inmobiliarias_admin', methods=['GET', 'POST'])
@login_required
def ofertas_admin():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT comuna::int, st_x(st_centroid(the_geom)) lat,st_y(st_centroid(the_geom)) lng from comunas ORDER BY comuna ASC;")
            datos = cursor.fetchall()
            comunas = [dato[0] for dato in datos]
            comunas_completas = [{
                "comuna": dato[0],
                "lat": dato[2],
                "lng": dato[1],
            } for dato in datos]
            cursor.execute("SELECT DISTINCT estado::text FROM ofertas_cali;")
            datos2 = cursor.fetchall()
            estado = [dato[0] for dato in datos2]
            cursor.execute("SELECT DISTINCT tipo_ofert::text FROM ofertas_cali;")
            datos3 = cursor.fetchall()
            tipo = [dato[0] for dato in datos3]
            cursor.execute("SELECT DISTINCT inmueble::text FROM ofertas_cali;")
            datos4 = cursor.fetchall()
            inmueble = [dato[0] for dato in datos4]
    return render_template('indexAdmin.html',lenCom=len(comunas),comunas=comunas, comunas_completas=comunas_completas,lenEst=len(estado),estado=estado,lenTipo=len(tipo),tipo=tipo,lenInmueble=len(inmueble), inmueble=inmueble)

@app.route('/inmobiliarias', methods=['GET', 'POST'])
@login_required
def ofertas_user():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT comuna::int, st_x(st_centroid(the_geom)) lat,st_y(st_centroid(the_geom)) lng from comunas ORDER BY comuna ASC;")
            datos = cursor.fetchall()
            comunas = [dato[0] for dato in datos]
            comunas_completas = [{
                "comuna": dato[0],
                "lat": dato[2],
                "lng": dato[1],
            } for dato in datos]
            cursor.execute("SELECT DISTINCT estado::text FROM ofertas_cali;")
            datos2 = cursor.fetchall()
            estado = [dato[0] for dato in datos2]
            cursor.execute("SELECT DISTINCT tipo_ofert::text FROM ofertas_cali;")
            datos3 = cursor.fetchall()
            tipo = [dato[0] for dato in datos3]
            cursor.execute("SELECT DISTINCT inmueble::text FROM ofertas_cali;")
            datos4 = cursor.fetchall()
            inmueble = [dato[0] for dato in datos4]
    return render_template('indexUser.html',lenCom=len(comunas),comunas=comunas, comunas_completas=comunas_completas,lenEst=len(estado),estado=estado,lenTipo=len(tipo),tipo=tipo,lenInmueble=len(inmueble), inmueble=inmueble)


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/registro', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()
    if form.validate_on_submit():
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """insert into 
                            usuarios(username, password, tipo_usuario) 
                            values(%s, md5(%s), %s);""",
                    (form.username.data, form.password.data, form.tipo_usuario.data)
                )
                return redirect(url_for('login'))

    return render_template('signup.html', form=form)




# Backend


# Consultas
ESTADISTICA = """SELECT inmueble, ROUND(AVG(valor_pedi),2), ROUND(MAX(valor_pedi),2), ROUND(MIN(valor_pedi),2)
FROM ofertas_cali
WHERE comuna ilike %s and estado ilike %s and tipo_ofert ilike %s
GROUP BY inmueble;"""

ESTADISTICA_ESPACIAL = "SELECT * FROM ofertas_cali WHERE comuna ilike %s and estado ilike %s and tipo_ofert ilike %s;"

ELIMINA = "DELETE FROM ofertas_cali WHERE gid =%s;"

EDITA = "UPDATE ofertas_cali SET tipo_ofert=%s, inmueble=%s, acabados=%s, estado=%s, valor_pedi=%s WHERE gid =%s;"

INGRESA = """INSERT INTO ofertas_cali(
	barrio,
	comuna,
	inmueble,
	tipo_ofert,
	estrato,
	acabados,
	estado,
	valor_pedi,
	the_geom
) VALUES (
	%s,
	%s,
	%s,
	%s,
	%s,
	%s,
	%s,
	%s,
	ST_GeometryFromText(%s)
)"""


# Terminan consultas


@app.get("/api/estadistica/<comuna>/<estado>/<tipo_oferta>")
def get_estadistica(comuna,estado,tipo_oferta):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(ESTADISTICA,(comuna,estado,tipo_oferta,))
            datos = cursor.fetchall()
    return [{
        "tipo_inmueble": dato[0],
        "promedio": dato[1],
        "minimo": dato[3],
        "maximo": dato[2],
    } for dato in datos]


## Eliminar
@app.delete("/api/elimina_oferta/<id_oferta>")
def delete_oferta(id_oferta):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(ELIMINA,(id_oferta,))
    return {"Se eliminó la oferta con ID": id_oferta}

## Editar
@app.post("/api/edita_oferta/<tipo_ofert>/<inmueble>/<acabados>/<estado>/<valor_pedi>/<id_oferta>")
def editar_oferta(tipo_ofert,inmueble,acabados,estado,valor_pedi,id_oferta):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(EDITA,(tipo_ofert,inmueble,acabados,estado,valor_pedi,id_oferta,))
    return {"Se editó la oferta con ID": id_oferta}

## Agregar
@app.post("/api/agrega_oferta/<barrio>/<comuna>/<inmueble>/<tipo_ofert>/<estrato>/<acabados>/<estado>/<valor_pedi>/<datoGeom>")
def agregar_oferta(barrio,comuna,inmueble,tipo_ofert,estrato,acabados,estado,valor_pedi,datoGeom):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(INGRESA,(barrio,comuna,inmueble,tipo_ofert,estrato,acabados,estado,valor_pedi,datoGeom,))
    return {"Mensaje": "Se agregó una nueva oferta"}

if __name__ == '__main__':
    app.run(debug=True)
