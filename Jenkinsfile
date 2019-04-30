pipeline {
  agent {
    docker {
      image 'node'
      args '''
'''
    }

  }
  stages {
    stage('build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('compile') {
      steps {
        sh 'npm run template 1 /root/template'
      }
    }
  }
}
