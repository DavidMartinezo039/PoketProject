from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

# get_user_model() devuelve TU modelo de usuario (accounts.User), no el de Django.
# Siempre que necesites el User en código reutilizable, úsalo en vez de importar User directamente.
User = get_user_model()


class LoginTests(APITestCase):
    # La misma URL que llama tu frontend. Fíjate en la barra inicial "/".
    url = "/api/auth/login/"

    def setUp(self):
        # setUp() se ejecuta ANTES de cada test (de cada método test_*).
        # Creamos un usuario de prueba en la base de datos de test.
        self.username = "david"
        self.password = "clave-secreta-123"
        # create_user() hashea la contraseña por nosotros. Esto es CLAVE:
        # si pusieras user.password = "..." a mano, el login nunca funcionaría.
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    def test_login_correcto_devuelve_token(self):
        # Arrange: credenciales válidas
        datos = {"username": self.username, "password": self.password}

        # Act: POST al endpoint, igual que hace el frontend
        respuesta = self.client.post(self.url, datos)

        # Assert: 200 y un token no vacío en la respuesta
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertIn("token", respuesta.data)
        self.assertTrue(respuesta.data["token"])

    def test_password_incorrecta_devuelve_400(self):
        datos = {"username": self.username, "password": "esta-no-es"}

        respuesta = self.client.post(self.url, datos)

        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn("token", respuesta.data)

    def test_usuario_inexistente_devuelve_400(self):
        datos = {"username": "no-existe", "password": "loquesea"}

        respuesta = self.client.post(self.url, datos)

        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sin_datos_devuelve_400(self):
        respuesta = self.client.post(self.url, {})

        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
