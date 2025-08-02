pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('Clonar código') {
      steps {
        checkout scm
      }
    }
    stage('Limpiar e instalar dependencias') {
        steps {
            sh 'rm -rf node_modules package-lock.json'
            sh 'npm cache clean --force'
            sh 'npm install'
        }
    }


    stage('Instalar dependencias') {
      steps {
        sh 'npm install'
      }
    }
     stage('Instalar Tailwind CSS') {
      steps {
        sh 'npm install tailwindcss @tailwindcss/vite'
      }
    }
    stage('Instalar React Icons') {
      steps {
        sh 'npm install react-icons'
      }
    }
    stage('Asegurar permisos') {
        steps {
            sh '''
            chmod +x node_modules/.bin/vite
            ls -l node_modules/.bin/vite
            '''
        }
    }
    stage('Build de producción') {
      steps {
        sh'npm run build'
      }
    }

    stage('Empaquetar en Docker (opcional)') {
      steps {
        sh 'docker build -t mi-frontend .'
      }
    }

    stage('Despliegue (local o remoto)') {
      steps {
        sh '''
          docker stop frontend || true
          docker rm frontend || true
          docker run -d --name frontend -p 80:80 mi-frontend
        '''
      }
    }
  }
}
