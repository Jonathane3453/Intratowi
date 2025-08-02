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
    stage('Limpiar workspace (forzado)') {
        steps {
            deleteDir()
       }
    }


    stage('Instalación limpia') {
      steps {
        sh '''
          rm -rf node_modules package-lock.json
          npm cache clean --force
          npm install
        '''
      }
    }
    stage('Forzar instalación de plugin-react') {
        steps {
            sh 'npm install -g @vitejs/plugin-react'
        }
    }
    stage('Verificar lista de dependencias') {
        steps {
            sh 'npm list --depth=0'
        }
    }
    stage('Verificar instalación') {
      steps {
        sh 'ls -la node_modules/@vitejs/plugin-react || echo "NO SE INSTALÓ"'
      }
    }

    stage('Permisos vite') {
      steps {
        sh 'chmod +x node_modules/.bin/vite || true'
      }
    }

    stage('Build de producción') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Empaquetar en Docker (opcional)') {
      steps {
        sh 'docker build -t mi-frontend .'
      }
    }

    stage('Despliegue') {
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
